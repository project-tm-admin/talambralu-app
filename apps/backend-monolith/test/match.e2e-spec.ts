import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/common/prisma/prisma.service';
import { MatchStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest
      .fn()
      .mockResolvedValue({ uid: 'user-a-id', email: 'user-a@example.com' }),
  }),
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
    applicationDefault: jest.fn(),
  },
  apps: [],
}));

describe('Match (e2e)', () => {
  let app: INestApplication;

  const mockPrismaService = {
    match: {
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
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
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it('POST /v1/interests (Success)', () => {
    mockPrismaService.match.findFirst.mockResolvedValue(null);
    mockPrismaService.match.create.mockResolvedValue({
      id: 'match-id',
      senderId: 'user-a-id',
      receiverId: 'user-b-id',
      status: MatchStatus.PENDING,
    });

    return request(app.getHttpServer())
      .post('/v1/interests')
      .set('Authorization', 'Bearer token')
      .send({ receiverId: 'user-b-id' })
      .expect(201)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.id).toBe('match-id');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.status).toBe(MatchStatus.PENDING);
      });
  });

  it('POST /v1/interests (Self Interest Error)', () => {
    return request(app.getHttpServer())
      .post('/v1/interests')
      .set('Authorization', 'Bearer token')
      .send({ receiverId: 'user-a-id' })
      .expect(400);
  });

  it('POST /v1/interests/:id/accept (Success)', () => {
    mockPrismaService.match.findUnique.mockResolvedValue({
      id: 'match-id',
      senderId: 'user-b-id',
      receiverId: 'user-a-id',
      status: MatchStatus.PENDING,
    });
    mockPrismaService.match.update.mockResolvedValue({
      id: 'match-id',
      status: MatchStatus.ACCEPTED,
    });

    return request(app.getHttpServer())
      .post('/v1/interests/match-id/accept')
      .set('Authorization', 'Bearer token')
      .expect(201)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.status).toBe(MatchStatus.ACCEPTED);
      });
  });

  it('POST /v1/interests/:id/accept (Forbidden - Not Recipient)', () => {
    mockPrismaService.match.findUnique.mockResolvedValue({
      id: 'match-id',
      senderId: 'user-a-id',
      receiverId: 'user-b-id',
      status: MatchStatus.PENDING,
    });

    return request(app.getHttpServer())
      .post('/v1/interests/match-id/accept')
      .set('Authorization', 'Bearer token')
      .expect(403);
  });

  it('POST /v1/interests/:id/decline (Success)', () => {
    mockPrismaService.match.findUnique.mockResolvedValue({
      id: 'match-id',
      senderId: 'user-b-id',
      receiverId: 'user-a-id',
      status: MatchStatus.PENDING,
    });
    mockPrismaService.match.update.mockResolvedValue({
      id: 'match-id',
      status: MatchStatus.DECLINED,
    });

    return request(app.getHttpServer())
      .post('/v1/interests/match-id/decline')
      .set('Authorization', 'Bearer token')
      .expect(201)
      .expect((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body.status).toBe(MatchStatus.DECLINED);
      });
  });

  it('POST /v1/interests (Duplicate PENDING - Conflict)', () => {
    mockPrismaService.match.findFirst.mockResolvedValue({
      id: 'match-id',
      senderId: 'user-a-id',
      receiverId: 'user-b-id',
      status: MatchStatus.PENDING,
    });

    return request(app.getHttpServer())
      .post('/v1/interests')
      .set('Authorization', 'Bearer token')
      .send({ receiverId: 'user-b-id' })
      .expect(409);
  });

  it('GET /v1/interests/pending (Success)', () => {
    mockPrismaService.match.findMany.mockResolvedValue([
      {
        id: 'match-1',
        senderId: 'user-b-id',
        receiverId: 'user-a-id',
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
      { id: 'match-1', status: MatchStatus.ACCEPTED },
    ]);

    return request(app.getHttpServer())
      .get('/v1/matches')
      .set('Authorization', 'Bearer token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
