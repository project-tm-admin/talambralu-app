/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { SubscriptionTier } from '@prisma/client';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;

  const mockService = {
    processWebhookEvent: jest.fn(),
    getTierForUser: jest.fn(),
  };

  const WEBHOOK_SECRET = 'test-webhook-secret';

  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.REVENUECAT_WEBHOOK_SECRET = WEBHOOK_SECRET;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [{ provide: SubscriptionService, useValue: mockService }],
    }).compile();

    controller = module.get<SubscriptionController>(SubscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleRevenueCatWebhook', () => {
    const validBody = {
      api_version: '1.0',
      event: {
        id: 'evt-001',
        type: 'INITIAL_PURCHASE',
        app_user_id: 'firebase-uid-1',
        original_app_user_id: 'firebase-uid-1',
        product_id: 'premium_monthly',
        store: 'APP_STORE',
      },
    };

    it('calls processWebhookEvent with valid auth header', async () => {
      mockService.processWebhookEvent.mockResolvedValue(undefined);

      const result = await controller.handleRevenueCatWebhook(
        WEBHOOK_SECRET,
        validBody,
      );

      expect(mockService.processWebhookEvent).toHaveBeenCalledWith(
        validBody.event,
      );
      expect(result).toEqual({ received: true });
    });

    it('throws UnauthorizedException with wrong auth header', async () => {
      await expect(
        controller.handleRevenueCatWebhook('wrong-secret', validBody as any),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockService.processWebhookEvent).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException with missing auth header', async () => {
      await expect(
        controller.handleRevenueCatWebhook(undefined as any, validBody as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getStatus', () => {
    it('returns tier for the authenticated user', async () => {
      mockService.getTierForUser.mockResolvedValue(SubscriptionTier.FREE);

      const result = await controller.getStatus({
        uid: 'firebase-uid-1',
      });

      expect(mockService.getTierForUser).toHaveBeenCalledWith('firebase-uid-1');
      expect(result).toEqual({ tier: SubscriptionTier.FREE });
    });
  });
});
