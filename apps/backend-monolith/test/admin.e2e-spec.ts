import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { PrismaReplicaService } from '../src/common/prisma/prisma-replica.service';
import * as admin from 'firebase-admin';

// We need to dynamically return a UID based on the token for our test
jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn((token: string) => {
      if (token === 'admin-token') return Promise.resolve({ uid: 'admin-uid' });
      if (token === 'normal-token') return Promise.resolve({ uid: 'normal-uid' });
      return Promise.reject(new Error('Invalid token'));
    }),
  }),
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
    applicationDefault: jest.fn().mockReturnValue({}),
  },
  apps: [],
}));

describe('AdminController (e2e)', () => {
  let app: INestApplication;

  const mockPrismaService = {
    profile: {
      findUnique: jest.fn(({ where: { userId } }) => {
        if (userId === 'admin-uid') {
          return Promise.resolve({ userId, isAdmin: true });
        }
        if (userId === 'normal-uid') {
          return Promise.resolve({ userId, isAdmin: false });
        }
        return Promise.resolve(null);
      }),
    },
  };

  const mockPrismaReplicaService = {
    profile: {
      count: jest.fn().mockResolvedValue(100),
    },
    match: {
      count: jest.fn().mockResolvedValue(50),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(PrismaReplicaService)
      .useValue(mockPrismaReplicaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /v1/admin/stats - fails without token', () => {
    return request(app.getHttpServer()).get('/v1/admin/stats').expect(401);
  });

  it('GET /v1/admin/stats - fails with invalid token', () => {
    return request(app.getHttpServer())
      .get('/v1/admin/stats')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });

  it('GET /v1/admin/stats - fails for normal user', () => {
    return request(app.getHttpServer())
      .get('/v1/admin/stats')
      .set('Authorization', 'Bearer normal-token')
      .expect(403)
      .expect((res) => {
        expect(res.body.error.message).toBe('User does not have admin privileges');
      });
  });

  it('GET /v1/admin/stats - succeeds for admin user', () => {
    return request(app.getHttpServer())
      .get('/v1/admin/stats')
      .set('Authorization', 'Bearer admin-token')
      .expect(200)
      .expect((res) => {
        expect(res.body.data.totalUsers).toBe(100);
        expect(res.body.data.totalMatches).toBe(50);
        expect(res.body.data.verifications).toBeDefined();
      });
  });
});
