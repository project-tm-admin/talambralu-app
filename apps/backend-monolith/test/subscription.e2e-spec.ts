import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionTier } from '@prisma/client';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/common/prisma/prisma.service';

// Provide a default mocked credential so tests don't fail trying to reach AWS metadata
jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest
      .fn()
      .mockResolvedValue({ uid: 'firebase-uid-1', email: 'user@example.com' }),
  }),
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
    applicationDefault: jest.fn().mockReturnValue({}),
  },
  apps: [],
}));

describe('Subscription (e2e)', () => {
  let app: INestApplication;

  const WEBHOOK_SECRET = 'test-webhook-secret-e2e';

  const mockTx = {
    userSubscription: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };

  const mockPrisma = {
    $transaction: jest.fn(async (cb) => cb(mockTx)),
    userSubscription: {
      findUnique: jest.fn(),
    },
  };

  beforeAll(() => {
    process.env.REVENUECAT_WEBHOOK_SECRET = WEBHOOK_SECRET;
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const validWebhookPayload = {
    api_version: '1.0',
    event: {
      id: 'evt-e2e-001',
      type: 'INITIAL_PURCHASE',
      app_user_id: 'firebase-uid-1',
      original_app_user_id: 'firebase-uid-1',
      product_id: 'premium_monthly',
      store: 'APP_STORE',
    },
  };

  describe('POST /v1/webhooks/revenuecat', () => {
    it('returns 200 and processes event with valid auth header', async () => {
      mockTx.userSubscription.findUnique.mockResolvedValue(null);
      mockTx.userSubscription.upsert.mockResolvedValue({});

      return request(app.getHttpServer())
        .post('/v1/webhooks/revenuecat')
        .set('Authorization', WEBHOOK_SECRET)
        .send(validWebhookPayload)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ received: true });
        });
    });

    it('returns 401 with wrong auth header', () => {
      return request(app.getHttpServer())
        .post('/v1/webhooks/revenuecat')
        .set('Authorization', 'wrong-secret')
        .send(validWebhookPayload)
        .expect(401);
    });

    it('returns 401 with missing auth header', () => {
      return request(app.getHttpServer())
        .post('/v1/webhooks/revenuecat')
        .send(validWebhookPayload)
        .expect(401);
    });

    it('returns 400 when event field is missing', () => {
      return request(app.getHttpServer())
        .post('/v1/webhooks/revenuecat')
        .set('Authorization', WEBHOOK_SECRET)
        .send({ api_version: '1.0' })
        .expect(400);
    });

    it('returns 400 when body is empty', () => {
      return request(app.getHttpServer())
        .post('/v1/webhooks/revenuecat')
        .set('Authorization', WEBHOOK_SECRET)
        .send({})
        .expect(400);
    });
  });

  describe('GET /v1/subscription/status', () => {
    it('returns 401 when no Bearer token provided', () => {
      return request(app.getHttpServer())
        .get('/v1/subscription/status')
        .expect(401);
    });

    it('returns FREE tier for a user with no subscription record', async () => {
      mockPrisma.userSubscription.findUnique.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/v1/subscription/status')
        .set('Authorization', 'Bearer valid-firebase-token')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ tier: SubscriptionTier.FREE });
        });
    });

    it('returns PREMIUM tier for a subscribed user', async () => {
      mockPrisma.userSubscription.findUnique.mockResolvedValue({
        tier: SubscriptionTier.PREMIUM,
      });

      return request(app.getHttpServer())
        .get('/v1/subscription/status')
        .set('Authorization', 'Bearer valid-firebase-token')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ tier: SubscriptionTier.PREMIUM });
        });
    });
  });
});
