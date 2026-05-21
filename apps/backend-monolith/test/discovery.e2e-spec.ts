import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/common/prisma/prisma.service';
import { PrismaReplicaService } from './../src/common/prisma/prisma-replica.service';
import { Gender } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest
      .fn()
      .mockResolvedValue({ uid: 'me-id', email: 'me@example.com' }),
  }),
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
    applicationDefault: jest.fn(),
  },
  apps: [],
}));

describe('Discovery (e2e)', () => {
  let app: INestApplication;

  const mockProfiles = [
    {
      id: 'uuid1',
      userId: 'user1',
      fullName: 'Alice',
      dob: new Date('1995-01-01'),
      gender: Gender.FEMALE,
      isFaceVerified: true,
      isIncomeVerified: false,
    },
    {
      id: 'uuid2',
      userId: 'user2',
      fullName: 'Bob',
      dob: new Date('1985-01-01'),
      gender: Gender.MALE,
      isFaceVerified: false,
      isIncomeVerified: true,
    },
  ];

  const mockPrismaService = {
    profile: {
      findMany: jest.fn().mockResolvedValue(mockProfiles),
      count: jest.fn().mockResolvedValue(2),
    },
    match: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string): string | undefined => {
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

  it('GET /v1/discovery (Success - No filters)', () => {
    return request(app.getHttpServer())
      .get('/v1/discovery')
      .set('Authorization', 'Bearer dummy-token')
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toHaveLength(2);
        expect(res.body.total).toBe(2);
        expect(mockPrismaService.profile.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { userId: { notIn: ['me-id'] } }, // now it uses notIn with array
          }),
        );
      });
  });

  it('GET /v1/discovery (Success - With filters)', () => {
    return request(app.getHttpServer())
      .get('/v1/discovery?gender=FEMALE&isFaceVerified=true&minAge=20')
      .set('Authorization', 'Bearer dummy-token')
      .expect(200)
      .expect(() => {
        expect(mockPrismaService.profile.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              gender: 'FEMALE',
              isFaceVerified: true,
            }),
          }),
        );
      });
  });

  it('GET /v1/discovery (Excludes passed profiles from results)', () => {
    const passedUserId = 'passed-user-id';
    mockPrismaService.match.findMany.mockResolvedValueOnce([
      { senderId: 'me-id', receiverId: passedUserId },
    ]);

    return request(app.getHttpServer())
      .get('/v1/discovery')
      .set('Authorization', 'Bearer dummy-token')
      .expect(200)
      .expect(() => {
        expect(mockPrismaService.profile.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              userId: expect.objectContaining({
                notIn: expect.arrayContaining(['me-id', passedUserId]),
              }),
            }),
          }),
        );
      });
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
