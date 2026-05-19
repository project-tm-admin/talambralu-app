import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionService } from '../subscription.service';
import { SubscriptionTier } from '@prisma/client';
import { REQUIRE_TIER_KEY } from '../decorators/require-tier.decorator';

interface RequestWithUser {
  user?: {
    uid: string;
  };
}

const TIER_RANK: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 0,
  [SubscriptionTier.PREMIUM]: 1,
};

@Injectable()
export class SubscriptionGuard implements CanActivate {
  private readonly logger = new Logger(SubscriptionGuard.name);

  constructor(
    private reflector: Reflector,
    private subscriptionService: SubscriptionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredTier = this.reflector.getAllAndOverride<SubscriptionTier>(
      REQUIRE_TIER_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredTier) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !user.uid) {
      throw new UnauthorizedException({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          details: {},
        },
      });
    }

    let userTier: SubscriptionTier;
    try {
      userTier = await this.subscriptionService.getTierForUser(user.uid);
    } catch (err) {
      this.logger.error('Failed to retrieve subscription tier', err);
      throw new InternalServerErrorException({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Could not verify subscription status',
          details: {},
        },
      });
    }

    if (TIER_RANK[userTier] < TIER_RANK[requiredTier]) {
      throw new ForbiddenException({
        error: {
          code: 'SUBSCRIPTION_REQUIRED',
          message: 'Premium subscription required',
          details: { required: requiredTier, current: userTier },
        },
      });
    }

    return true;
  }
}
