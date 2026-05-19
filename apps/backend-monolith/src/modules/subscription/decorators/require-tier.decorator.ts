import { SetMetadata } from '@nestjs/common';
import { SubscriptionTier } from '@prisma/client';

export const REQUIRE_TIER_KEY = 'requireTier';
export const RequireTier = (tier: SubscriptionTier) =>
  SetMetadata(REQUIRE_TIER_KEY, tier);
