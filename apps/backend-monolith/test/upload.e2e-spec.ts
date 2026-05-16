import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
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
    applicationDefault: jest.fn(),
  },
  apps: [],
}));

jest.mock('@aws-sdk/s3-presigned-post', () => {
  return {
    createPresignedPost: jest.fn().mockResolvedValue({
      url: 'https://mocked-presigned-url.com',
      fields: { 'Content-Type': 'image/jpeg', key: 'mocked-key' },
    }),
  };
});

describe('Upload (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'AWS_REGION') return 'us-east-1';
          if (key === 'AWS_S3_PUBLIC_BUCKET') return 'public-bucket';
          if (key === 'AWS_S3_PRIVATE_BUCKET') return 'private-bucket';
          return 'dummy'; // For Firebase config keys
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('POST /v1/upload/presigned-post (Success)', () => {
    return request(app.getHttpServer())
      .post('/v1/upload/presigned-post')
      .set('Authorization', 'Bearer dummy-token')
      .send({
        purpose: 'PROFILE_PHOTO',
        contentType: 'image/jpeg',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.url).toBe('https://mocked-presigned-url.com');
        expect(res.body.key).toContain('profile-photos/test-user-id/');
      });
  });

  it('POST /v1/upload/presigned-post (Validation Failure - Invalid Purpose)', () => {
    return request(app.getHttpServer())
      .post('/v1/upload/presigned-post')
      .set('Authorization', 'Bearer dummy-token')
      .send({
        purpose: 'INVALID_PURPOSE',
        contentType: 'image/jpeg',
      })
      .expect(400);
  });

  it('POST /v1/upload/presigned-post (Unauthorized - No Token)', () => {
    return request(app.getHttpServer())
      .post('/v1/upload/presigned-post')
      .send({
        purpose: 'PROFILE_PHOTO',
        contentType: 'image/jpeg',
      })
      .expect(401);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
