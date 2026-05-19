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

    // Use transaction to prevent concurrency race conditions
    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.userSubscription.findUnique({
        where: { userId },
      });

      // 1. Idempotency check
      if (existing?.lastEventId === event.id) {
        this.logger.debug(`Skipping idempotent event ${event.id}`);
        return;
      }

      const eventTimeMs = event.purchased_at_ms ?? Date.now();
      const eventDate = new Date(eventTimeMs);

      // 2. Sequence check (Out-of-order webhook protection)
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
      }
    });
  }

  async getTierForUser(userId: string): Promise<SubscriptionTier> {
    const sub = await this.prisma.userSubscription.findUnique({
      where: { userId },
    });
    return sub?.tier ?? SubscriptionTier.FREE;
  }
}