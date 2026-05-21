import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/common/prisma/prisma.service';
import { PrismaReplicaService } from './../src/common/prisma/prisma-replica.service';
import { MatchStatus, SubscriptionTier } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user-a@example.com',
    }),
  }),
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
    applicationDefault: jest.fn().mockReturnValue({}),
  },
  apps: [],
}));

const AUTH_UID = '123e4567-e89b-12d3-a456-426614174000';

describe('Match (e2e)', () => {
  let app: INestApplication;

  const VALID_UUID_A = AUTH_UID;
  const VALID_UUID_B = '123e4567-e89b-12d3-a456-426614174001';
  const VALID_UUID_C = '123e4567-e89b-12d3-a456-426614174002';

  const mockPrismaService = {
    match: {
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    userSubscription: {
      findUnique: jest
        .fn()
        .mockResolvedValue({ tier: SubscriptionTier.PREMIUM }),
    },
    shortlist: {
      upsert: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
    },
    profile: {
      findMany: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        AWS_REGION: 'us-east-1',
        AWS_S3_PUBLIC_BUCKET: 'public-bucket',
        AWS_S3_PRIVATE_BUCKET: 'private-bucket',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .overrideProvider(PrismaReplicaService)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it('POST /v1/interests (Success)', () => {
    mockPrismaService.match.findFirst.mockResolvedValue(null);
    mockPrismaService.userSubscription.findUnique.mockResolvedValue({
      tier: SubscriptionTier.PREMIUM,
    });
    mockPrismaService.match.create.mockResolvedValue({
      id: VALID_UUID_A,
      senderId: VALID_UUID_A,
      receiverId: VALID_UUID_B,
      status: MatchStatus.PENDING,
    });

    return request(app.getHttpServer())
      .post('/v1/interests')
      .set('Authorization', 'Bearer token')
      .send({ receiverId: VALID_UUID_B })
      .expect(201)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.status).toBe(MatchStatus.PENDING);
      });
  });

  it('POST /v1/interests (Forbidden - FREE tier)', () => {
    mockPrismaService.userSubscription.findUnique.mockResolvedValue({
      tier: SubscriptionTier.FREE,
    });
    return request(app.getHttpServer())
      .post('/v1/interests')
      .set('Authorization', 'Bearer token')
      .send({ receiverId: VALID_UUID_B })
      .expect(403)
      .expect((res) => {
        expect(res.body).toMatchObject({
          error: { code: 'SUBSCRIPTION_REQUIRED' },
        });
      });
  });

  it('POST /v1/interests (Self Interest Error)', () => {
    // Sender UID === receiverId — service rejects as self-interest (400)
    mockPrismaService.userSubscription.findUnique.mockResolvedValue({
      tier: SubscriptionTier.PREMIUM,
    });
    return request(app.getHttpServer())
      .post('/v1/interests')
      .set('Authorization', 'Bearer token')
      .send({ receiverId: VALID_UUID_A })
      .expect(400);
  });

  it('POST /v1/interests/:id/accept (Success)', () => {
    mockPrismaService.userSubscription.findUnique.mockResolvedValue({
      tier: SubscriptionTier.PREMIUM,
    });
    mockPrismaService.match.findUnique.mockResolvedValue({
      id: VALID_UUID_A,
      senderId: VALID_UUID_B,
      receiverId: VALID_UUID_A,
      status: MatchStatus.PENDING,
    });
    mockPrismaService.match.update.mockResolvedValue({
      id: VALID_UUID_A,
      status: MatchStatus.ACCEPTED,
    });

    return request(app.getHttpServer())
      .post(`/v1/interests/${VALID_UUID_A}/accept`)
      .set('Authorization', 'Bearer token')
      .expect(201)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.status).toBe(MatchStatus.ACCEPTED);
      });
  });

  it('POST /v1/interests/:id/accept (Forbidden - FREE tier)', () => {
    mockPrismaService.userSubscription.findUnique.mockResolvedValue({
      tier: SubscriptionTier.FREE,
    });
    return request(app.getHttpServer())
      .post(`/v1/interests/${VALID_UUID_A}/accept`)
      .set('Authorization', 'Bearer token')
      .expect(403)
      .expect((res) => {
        expect(res.body).toMatchObject({
          error: { code: 'SUBSCRIPTION_REQUIRED' },
        });
      });
  });

  it('POST /v1/interests/:id/accept (Forbidden - Not Recipient)', () => {
    mockPrismaService.userSubscription.findUnique.mockResolvedValue({
      tier: SubscriptionTier.PREMIUM,
    });
    mockPrismaService.match.findUnique.mockResolvedValue({
      id: VALID_UUID_A,
      senderId: VALID_UUID_A,
      receiverId: VALID_UUID_B,
      status: MatchStatus.PENDING,
    });

    return request(app.getHttpServer())
      .post(`/v1/interests/${VALID_UUID_A}/accept`)
      .set('Authorization', 'Bearer token')
      .expect(403);
  });

  it('POST /v1/interests/:id/decline (Success)', () => {
    mockPrismaService.userSubscription.findUnique.mockResolvedValue({
      tier: SubscriptionTier.PREMIUM,
    });
    mockPrismaService.match.findUnique.mockResolvedValue({
      id: VALID_UUID_A,
      senderId: VALID_UUID_B,
      receiverId: VALID_UUID_A,
      status: MatchStatus.PENDING,
    });
    mockPrismaService.match.update.mockResolvedValue({
      id: VALID_UUID_A,
      status: MatchStatus.DECLINED,
    });

    return request(app.getHttpServer())
      .post(`/v1/interests/${VALID_UUID_A}/decline`)
      .set('Authorization', 'Bearer token')
      .expect(201)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.status).toBe(MatchStatus.DECLINED);
      });
  });

  it('POST /v1/interests (Duplicate PENDING - Conflict)', () => {
    mockPrismaService.userSubscription.findUnique.mockResolvedValue({
      tier: SubscriptionTier.PREMIUM,
    });
    mockPrismaService.match.findFirst.mockResolvedValue({
      id: VALID_UUID_A,
      senderId: VALID_UUID_A,
      receiverId: VALID_UUID_B,
      status: MatchStatus.PENDING,
    });

    return request(app.getHttpServer())
      .post('/v1/interests')
      .set('Authorization', 'Bearer token')
      .send({ receiverId: VALID_UUID_B })
      .expect(409);
  });

  it('GET /v1/interests/pending (Success)', () => {
    mockPrismaService.match.findMany.mockResolvedValue([
      {
        id: VALID_UUID_A,
        senderId: VALID_UUID_B,
        receiverId: VALID_UUID_A,
        status: MatchStatus.PENDING,
      },
    ]);

    return request(app.getHttpServer())
      .get('/v1/interests/pending')
      .set('Authorization', 'Bearer token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body[0].status).toBe(MatchStatus.PENDING);
      });
  });

  it('GET /v1/matches (Success)', () => {
    mockPrismaService.match.findMany.mockResolvedValue([
      { id: VALID_UUID_A, status: MatchStatus.ACCEPTED },
    ]);

    return request(app.getHttpServer())
      .get('/v1/matches')
      .set('Authorization', 'Bearer token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
      });
  });

  it('POST /v1/matches/pass (Success)', () => {
    mockPrismaService.match.findFirst.mockResolvedValue(null);
    mockPrismaService.match.create.mockResolvedValue({
      id: VALID_UUID_A,
      senderId: AUTH_UID,
      receiverId: VALID_UUID_B,
      status: MatchStatus.PASSED,
    });

    return request(app.getHttpServer())
      .post('/v1/matches/pass')
      .set('Authorization', 'Bearer token')
      .send({ receiverId: VALID_UUID_B })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', VALID_UUID_A);
        expect(res.body).toHaveProperty('status', MatchStatus.PASSED);
      });
  });

  it('POST /v1/matches/pass (Self Pass Error)', () => {
    return request(app.getHttpServer())
      .post('/v1/matches/pass')
      .set('Authorization', 'Bearer token')
      .send({ receiverId: AUTH_UID }) // same as AUTH_UID in FirebaseAuthGuard mock
      .expect(400);
  });

  it('POST /v1/matches/pass (Conflict - ACCEPTED match)', () => {
    mockPrismaService.match.findFirst.mockResolvedValue({
      id: VALID_UUID_A,
      senderId: VALID_UUID_A,
      receiverId: VALID_UUID_B,
      status: MatchStatus.ACCEPTED,
    });

    return request(app.getHttpServer())
      .post('/v1/matches/pass')
      .set('Authorization', 'Bearer token')
      .send({ receiverId: VALID_UUID_B })
      .expect(409);
  });

  it('POST /v1/matches/pass (Idempotent - already PASSED)', () => {
    const existing = {
      id: VALID_UUID_A,
      senderId: VALID_UUID_A,
      receiverId: VALID_UUID_B,
      status: MatchStatus.PASSED,
    };
    mockPrismaService.match.findFirst.mockResolvedValue(existing);

    return request(app.getHttpServer())
      .post('/v1/matches/pass')
      .set('Authorization', 'Bearer token')
      .send({ receiverId: VALID_UUID_B })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', MatchStatus.PASSED);
      });
  });

  it('POST /v1/matches/pass (PENDING from other party → DECLINED)', () => {
    mockPrismaService.match.findFirst.mockResolvedValue({
      id: VALID_UUID_A,
      senderId: VALID_UUID_B,
      receiverId: VALID_UUID_A, // caller (AUTH_UID) is the receiver
      status: MatchStatus.PENDING,
    });
    mockPrismaService.match.update.mockResolvedValue({
      id: VALID_UUID_A,
      senderId: VALID_UUID_B,
      receiverId: VALID_UUID_A,
      status: MatchStatus.DECLINED,
    });

    return request(app.getHttpServer())
      .post('/v1/matches/pass')
      .set('Authorization', 'Bearer token')
      .send({ receiverId: VALID_UUID_B })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', MatchStatus.DECLINED);
      });
  });

  // --- Shortlist Scenarios ---

  it('POST /v1/shortlist (Success)', () => {
    mockPrismaService.shortlist.upsert.mockResolvedValue({
      id: 'shortlist-id',
      userId: AUTH_UID,
      savedProfileId: VALID_UUID_B,
      createdAt: new Date(),
    });

    return request(app.getHttpServer())
      .post('/v1/shortlist')
      .set('Authorization', 'Bearer token')
      .send({ profileId: VALID_UUID_B })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty(
          'message',
          'Profile added to shortlist',
        );
      });
  });

  it('POST /v1/shortlist (Self Shortlist Error)', () => {
    return request(app.getHttpServer())
      .post('/v1/shortlist')
      .set('Authorization', 'Bearer token')
      .send({ profileId: AUTH_UID })
      .expect(400);
  });

  it('DELETE /v1/shortlist/:profileId (Success)', () => {
    mockPrismaService.shortlist.deleteMany.mockResolvedValue({ count: 1 });

    return request(app.getHttpServer())
      .delete(`/v1/shortlist/${VALID_UUID_B}`)
      .set('Authorization', 'Bearer token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty(
          'message',
          'Profile removed from shortlist',
        );
      });
  });

  it('DELETE /v1/shortlist/:profileId (Not Found)', () => {
    mockPrismaService.shortlist.deleteMany.mockResolvedValue({ count: 0 });

    return request(app.getHttpServer())
      .delete(`/v1/shortlist/${VALID_UUID_B}`)
      .set('Authorization', 'Bearer token')
      .expect(404);
  });

  it('POST /v1/shortlist (Idempotent - duplicate add returns 201)', async () => {
    mockPrismaService.shortlist.upsert.mockResolvedValue({
      id: 'shortlist-id',
      userId: AUTH_UID,
      savedProfileId: VALID_UUID_B,
      createdAt: new Date(),
    });

    await request(app.getHttpServer())
      .post('/v1/shortlist')
      .set('Authorization', 'Bearer token')
      .send({ profileId: VALID_UUID_B })
      .expect(201);

    return request(app.getHttpServer())
      .post('/v1/shortlist')
      .set('Authorization', 'Bearer token')
      .send({ profileId: VALID_UUID_B })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'Profile added to shortlist');
      });
  });

  it('GET /v1/shortlist (Empty shortlist returns [])', () => {
    mockPrismaService.shortlist.findMany.mockResolvedValue([]);

    return request(app.getHttpServer())
      .get('/v1/shortlist')
      .set('Authorization', 'Bearer token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual([]);
      });
  });

  it('GET /v1/shortlist (Success returns recency ordered profiles)', () => {
    mockPrismaService.shortlist.findMany.mockResolvedValue([
      {
        savedProfileId: VALID_UUID_B,
        createdAt: new Date('2026-05-21T10:00:00Z'),
      },
      {
        savedProfileId: VALID_UUID_C,
        createdAt: new Date('2026-05-20T10:00:00Z'),
      },
    ]);

    mockPrismaService.profile.findMany.mockResolvedValue([
      { userId: VALID_UUID_C, fullName: 'Other Profile' },
      { userId: VALID_UUID_B, fullName: 'Recent Profile' },
    ]);

    return request(app.getHttpServer())
      .get('/v1/shortlist')
      .set('Authorization', 'Bearer token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(2);
        // Should maintain the order from shortlist.findMany (VALID_UUID_B first)
        expect(res.body[0]).toHaveProperty('userId', VALID_UUID_B);
        expect(res.body[1]).toHaveProperty('userId', VALID_UUID_C);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
