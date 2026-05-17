import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/common/prisma/prisma.service';
import { MatchStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { UploadService } from './../src/modules/upload/upload.service';

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

describe('Communication (e2e)', () => {
  let app: INestApplication;

  const mockPrismaService = {
    match: {
      findUnique: jest.fn(),
    },
    message: {
      findMany: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        REDIS_URL: 'redis://localhost:6379',
        AWS_REGION: 'us-east-1',
        AWS_S3_PUBLIC_BUCKET: 'public-bucket',
        AWS_S3_PRIVATE_BUCKET: 'private-bucket',
      };
      return config[key];
    }),
  };

  const mockUploadService = {};

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .overrideProvider(UploadService)
      .useValue(mockUploadService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  describe('GET /v1/communication/messages/:matchId', () => {
    const matchId = '550e8400-e29b-41d4-a716-446655440000';

    it('should return messages if user is a participant (Success)', () => {
      mockPrismaService.match.findUnique.mockResolvedValue({
        id: matchId,
        senderId: 'user-a-id',
        receiverId: 'user-b-id',
        status: MatchStatus.ACCEPTED,
      });

      mockPrismaService.message.findMany.mockResolvedValue([
        { id: 'msg-1', content: 'hello', senderId: 'user-a-id', createdAt: new Date() },
      ]);

      return request(app.getHttpServer())
        .get(`/v1/communication/messages/${matchId}`)
        .set('Authorization', 'Bearer token')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0].content).toBe('hello');
        });
    });

    it('should return 403 if user is not a participant', () => {
      mockPrismaService.match.findUnique.mockResolvedValue({
        id: matchId,
        senderId: 'user-b-id',
        receiverId: 'user-c-id',
        status: MatchStatus.ACCEPTED,
      });

      return request(app.getHttpServer())
        .get(`/v1/communication/messages/${matchId}`)
        .set('Authorization', 'Bearer token')
        .expect(403);
    });

    it('should return 403 if match is not accepted', () => {
      mockPrismaService.match.findUnique.mockResolvedValue({
        id: matchId,
        senderId: 'user-a-id',
        receiverId: 'user-b-id',
        status: MatchStatus.PENDING,
      });

      return request(app.getHttpServer())
        .get(`/v1/communication/messages/${matchId}`)
        .set('Authorization', 'Bearer token')
        .expect(403);
    });

    it('should return 400 for invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/v1/communication/messages/invalid-uuid')
        .set('Authorization', 'Bearer token')
        .expect(400);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
