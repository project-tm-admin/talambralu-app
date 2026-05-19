/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionTier } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RevenueCatEvent } from './dto/revenuecat-webhook.dto';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionService', () => {
  let service: SubscriptionService;

  const mockTx = {
    userSubscription: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };

  const mockPrisma = {
    $transaction: jest.fn(async (cb) => cb(mockTx)),
    userSubscription: {
      findUnique: jest.fn(), // For getTierForUser
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const baseEvent = (
    overrides: Partial<RevenueCatEvent> = {},
  ): RevenueCatEvent => ({
    id: 'evt-001',
    type: 'INITIAL_PURCHASE',
    app_user_id: 'firebase-uid-1',
    original_app_user_id: 'firebase-uid-1',
    product_id: 'premium_monthly',
    store: 'APP_STORE',
    ...overrides,
  });

  describe('processWebhookEvent', () => {
    it('upserts PREMIUM tier on INITIAL_PURCHASE', async () => {
      mockTx.userSubscription.findUnique.mockResolvedValue(null);
      mockTx.userSubscription.upsert.mockResolvedValue({});

      await service.processWebhookEvent(
        baseEvent({ type: 'INITIAL_PURCHASE' }),
      );

      expect(mockTx.userSubscription.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'firebase-uid-1' },
          create: expect.objectContaining({ tier: SubscriptionTier.PREMIUM }),
          update: expect.objectContaining({ tier: SubscriptionTier.PREMIUM }),
        }),
      );
    });

    it('upserts PREMIUM tier on RENEWAL', async () => {
      mockTx.userSubscription.findUnique.mockResolvedValue({
        userId: 'firebase-uid-1',
        tier: SubscriptionTier.PREMIUM,
        lastEventId: 'evt-000',
      });
      mockTx.userSubscription.upsert.mockResolvedValue({});

      await service.processWebhookEvent(baseEvent({ type: 'RENEWAL' }));

      expect(mockTx.userSubscription.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({ tier: SubscriptionTier.PREMIUM }),
        }),
      );
    });

    it('upserts FREE tier on CANCELLATION', async () => {
      mockTx.userSubscription.findUnique.mockResolvedValue(null);
      mockTx.userSubscription.upsert.mockResolvedValue({});

      await service.processWebhookEvent(baseEvent({ type: 'CANCELLATION' }));

      expect(mockTx.userSubscription.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            tier: SubscriptionTier.FREE,
            expiresAt: null,
          }),
          update: expect.objectContaining({
            tier: SubscriptionTier.FREE,
            expiresAt: null,
          }),
        }),
      );
    });

    it('upserts FREE tier on EXPIRATION', async () => {
      mockTx.userSubscription.findUnique.mockResolvedValue(null);
      mockTx.userSubscription.upsert.mockResolvedValue({});

      await service.processWebhookEvent(baseEvent({ type: 'EXPIRATION' }));

      expect(mockTx.userSubscription.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({ tier: SubscriptionTier.FREE }),
        }),
      );
    });

    it('sets expiresAt from expiration_at_ms on RENEWAL', async () => {
      mockTx.userSubscription.findUnique.mockResolvedValue(null);
      mockTx.userSubscription.upsert.mockResolvedValue({});

      const expiresMs = 1893456000000;
      await service.processWebhookEvent(
        baseEvent({ type: 'RENEWAL', expiration_at_ms: expiresMs }),
      );

      expect(mockTx.userSubscription.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ expiresAt: new Date(expiresMs) }),
        }),
      );
    });

    it('skips DB write on idempotent re-delivery (same event.id)', async () => {
      mockTx.userSubscription.findUnique.mockResolvedValue({
        userId: 'firebase-uid-1',
        tier: SubscriptionTier.PREMIUM,
        lastEventId: 'evt-001',
      });

      await service.processWebhookEvent(baseEvent({ id: 'evt-001' }));

      expect(mockTx.userSubscription.upsert).not.toHaveBeenCalled();
    });

    it('performs no DB write for unknown event types', async () => {
      mockTx.userSubscription.findUnique.mockResolvedValue(null);

      await service.processWebhookEvent(baseEvent({ type: 'PRODUCT_CHANGE' }));

      expect(mockTx.userSubscription.upsert).not.toHaveBeenCalled();
    });

    it('skips older events (sequence protection)', async () => {
      mockTx.userSubscription.findUnique.mockResolvedValue({
        userId: 'firebase-uid-1',
        tier: SubscriptionTier.PREMIUM,
        lastEventId: 'evt-001',
        lastEventTimestamp: new Date(Date.now() + 10000), // Existing event is from the future relative to the new event
      });

      await service.processWebhookEvent(
        baseEvent({ id: 'evt-002', type: 'CANCELLATION', purchased_at_ms: Date.now() })
      );

      expect(mockTx.userSubscription.upsert).not.toHaveBeenCalled();
    });
  });

  describe('getTierForUser', () => {
    it('returns PREMIUM when subscription exists with PREMIUM tier', async () => {
      mockPrisma.userSubscription.findUnique.mockResolvedValue({
        tier: SubscriptionTier.PREMIUM,
      });

      const tier = await service.getTierForUser('firebase-uid-1');

      expect(tier).toBe(SubscriptionTier.PREMIUM);
    });

    it('returns FREE when no subscription record exists', async () => {
      mockPrisma.userSubscription.findUnique.mockResolvedValue(null);

      const tier = await service.getTierForUser('firebase-uid-1');

      expect(tier).toBe(SubscriptionTier.FREE);
    });

    it('returns FREE for a user with FREE tier', async () => {
      mockPrisma.userSubscription.findUnique.mockResolvedValue({
        tier: SubscriptionTier.FREE,
      });

      const tier = await service.getTierForUser('firebase-uid-1');

      expect(tier).toBe(SubscriptionTier.FREE);
    });
  });
});