import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionTier } from '@prisma/client';
import { REQUIRE_TIER_KEY } from '../decorators/require-tier.decorator';
import { SubscriptionService } from '../subscription.service';
import { SubscriptionGuard } from './subscription.guard';

describe('SubscriptionGuard', () => {
  let guard: SubscriptionGuard;
  let reflector: jest.Mocked<Reflector>;
  let subscriptionService: jest.Mocked<SubscriptionService>;

  beforeEach(async () => {
    const mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const mockSubscriptionService = {
      getTierForUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionGuard,
        { provide: Reflector, useValue: mockReflector },
        { provide: SubscriptionService, useValue: mockSubscriptionService },
      ],
    }).compile();

    guard = module.get<SubscriptionGuard>(SubscriptionGuard);
    reflector = module.get(Reflector);
    subscriptionService = module.get(SubscriptionService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  const createMockContext = (user?: { uid: string }) => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should return true if no required tier is set', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const context = createMockContext({ uid: 'user1' });

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(subscriptionService.getTierForUser).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if user is missing', async () => {
    reflector.getAllAndOverride.mockReturnValue(SubscriptionTier.PREMIUM);
    const context = createMockContext(undefined);

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          details: {},
        },
      }),
    );
  });

  it('should return true if user is PREMIUM and route requires PREMIUM', async () => {
    reflector.getAllAndOverride.mockReturnValue(SubscriptionTier.PREMIUM);
    const context = createMockContext({ uid: 'user1' });
    subscriptionService.getTierForUser.mockResolvedValue(
      SubscriptionTier.PREMIUM,
    );

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException if user is FREE and route requires PREMIUM', async () => {
    reflector.getAllAndOverride.mockReturnValue(SubscriptionTier.PREMIUM);
    const context = createMockContext({ uid: 'user1' });
    subscriptionService.getTierForUser.mockResolvedValue(SubscriptionTier.FREE);

    await expect(guard.canActivate(context)).rejects.toThrow(
      new ForbiddenException({
        error: {
          code: 'SUBSCRIPTION_REQUIRED',
          message: 'Premium subscription required',
          details: {
            required: SubscriptionTier.PREMIUM,
            current: SubscriptionTier.FREE,
          },
        },
      }),
    );
  });
});
