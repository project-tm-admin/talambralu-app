import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionTier } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RevenueCatEvent } from './dto/revenuecat-webhook.dto';

const UPGRADE_EVENTS = new Set(['INITIAL_PURCHASE', 'RENEWAL']);
const DOWNGRADE_EVENTS = new Set(['CANCELLATION', 'EXPIRATION']);

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processWebhookEvent(event: RevenueCatEvent): Promise<void> {
    const userId = event.app_user_id;

    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.userSubscription.findUnique({
        where: { userId },
      });

      // 1. Idempotency check
      if (existing?.lastEventId === event.id) {
        this.logger.debug(`Skipping idempotent event ${event.id}`);
        return;
      }

      // Use event_timestamp_ms (dispatch time) as primary sequence anchor;
      // fall back to purchased_at_ms for older payload shapes.
      const eventTimeMs =
        event.event_timestamp_ms ?? event.purchased_at_ms ?? Date.now();
      const eventDate = new Date(eventTimeMs);

      // 2. Sequence check (out-of-order webhook protection)
      if (
        existing?.lastEventTimestamp &&
        !isNaN(eventDate.getTime()) &&
        existing.lastEventTimestamp.getTime() > eventDate.getTime()
      ) {
        this.logger.warn(`Skipping older event ${event.id} for user ${userId}`);
        return;
      }

      let expiresAt: Date | null = null;
      if (
        event.expiration_at_ms !== undefined &&
        event.expiration_at_ms !== null
      ) {
        const d = new Date(event.expiration_at_ms);
        if (!isNaN(d.getTime())) {
          expiresAt = d;
        }
      }

      const lastEventTimestamp = isNaN(eventDate.getTime())
        ? new Date()
        : eventDate;

      if (UPGRADE_EVENTS.has(event.type)) {
        await tx.userSubscription.upsert({
          where: { userId },
          create: {
            userId,
            tier: SubscriptionTier.PREMIUM,
            lastEventId: event.id,
            lastEventTimestamp,
            expiresAt,
          },
          update: {
            tier: SubscriptionTier.PREMIUM,
            lastEventId: event.id,
            lastEventTimestamp,
            expiresAt,
          },
        });
      } else if (DOWNGRADE_EVENTS.has(event.type)) {
        // Only downgrade an existing subscription; never create a FREE row
        // for a user who was never premium — that would pollute the table.
        if (!existing) {
          this.logger.debug(
            `Skipping downgrade event ${event.id} — no subscription record for user ${userId}`,
          );
          return;
        }
        await tx.userSubscription.upsert({
          where: { userId },
          create: {
            userId,
            tier: SubscriptionTier.FREE,
            lastEventId: event.id,
            lastEventTimestamp,
            expiresAt: null,
          },
          update: {
            tier: SubscriptionTier.FREE,
            lastEventId: event.id,
            lastEventTimestamp,
            expiresAt: null,
          },
        });
      } else {
        this.logger.warn(
          `Unhandled event type ${event.type} for user ${userId} — no DB write performed`,
        );
      }
    });
  }

  async getTierForUser(userId: string): Promise<SubscriptionTier> {
    const sub = await this.prisma.userSubscription.findUnique({
      where: { userId },
    });
    if (!sub) return SubscriptionTier.FREE;
    // Safety net: treat as FREE if the subscription has expired locally,
    // even if the EXPIRATION webhook hasn't arrived yet.
    if (sub.expiresAt && sub.expiresAt < new Date()) return SubscriptionTier.FREE;
    return sub.tier;
  }
}
