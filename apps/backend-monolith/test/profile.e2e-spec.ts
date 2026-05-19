import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/common/prisma/prisma.service';
import { Gender } from '@prisma/client';
import * as admin from 'firebase-admin';

jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest
      .fn()
      .mockResolvedValue({ uid: 'test-user-id', email: 'test@example.com' }),
  }),
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
    applicationDefault: jest.fn().mockReturnValue({}),
  },
  apps: [],
}));

describe('Profile (e2e)', () => {
  let app: INestApplication;

  const mockUser = { uid: 'test-user-id', email: 'test@example.com' };

  const mockPrismaService = {
    profile: {
      upsert: jest.fn().mockResolvedValue({
        id: 'uuid',
        userId: mockUser.uid,
        fullName: 'John Doe',
        dob: new Date('1990-01-01'),
        gender: Gender.MALE,
      }),
      findUnique: jest.fn().mockResolvedValue({
        id: 'uuid',
        userId: mockUser.uid,
        fullName: 'John Doe',
        dob: new Date('1990-01-01'),
        gender: Gender.MALE,
      }),
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('POST /v1/profiles (Success)', () => {
    return request(app.getHttpServer())
      .post('/v1/profiles')
      .set('Authorization', 'Bearer dummy-token')
      .send({
        fullName: 'John Doe',
        dob: '1990-01-01',
        gender: 'MALE',
      })
      .expect(201);
  });

  it('POST /v1/profiles (Validation Failure - Invalid Gender)', () => {
    return request(app.getHttpServer())
      .post('/v1/profiles')
      .set('Authorization', 'Bearer dummy-token')
      .send({
        fullName: 'John Doe',
        dob: '1990-01-01',
        gender: 'INVALID_GENDER',
      })
      .expect(400);
  });

  it('GET /v1/profiles/me (Success)', () => {
    return request(app.getHttpServer())
      .get('/v1/profiles/me')
      .set('Authorization', 'Bearer dummy-token')
      .expect(200)
      .expect((res) => {
        expect(res.body.userId).toBe(mockUser.uid);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
