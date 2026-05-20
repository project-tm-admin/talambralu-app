import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/common/prisma/prisma.service';
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import * as admin from 'firebase-admin';
import { CleanupService } from './../src/modules/cleanup/cleanup.service';

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-user-id', email: 'test@example.com' }),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  }),
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
    applicationDefault: jest.fn().mockReturnValue({}),
  },
  apps: [],
}));

// Mock AWS SQS
jest.mock('@aws-sdk/client-sqs', () => {
  const mockSend = jest.fn().mockResolvedValue({ MessageId: 'test-message-id' });
  return {
    SQSClient: jest.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    SendMessageCommand: jest.fn().mockImplementation((args) => args),
    ReceiveMessageCommand: jest.fn().mockImplementation((args) => args),
    DeleteMessageCommand: jest.fn().mockImplementation((args) => args),
  };
});

describe('Account Deletion (e2e)', () => {
  let app: INestApplication;

  const mockUser = { uid: 'test-user-id', email: 'test@example.com' };

  const mockPrismaService = {
    profile: {
      delete: jest.fn().mockResolvedValue({ userId: mockUser.uid }),
      findUnique: jest.fn().mockResolvedValue({ userId: mockUser.uid }),
    },
  };

  beforeEach(async () => {
    // Set required environment variables for the test
    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_SQS_CLEANUP_QUEUE_URL = 'http://localhost/cleanup-queue';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(CleanupService)
      .useValue({ onModuleInit: jest.fn() }) // Prevent polling
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('DELETE /v1/profiles/me (Success)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/profiles/me')
      .set('Authorization', 'Bearer dummy-token')
      .expect(200);

    expect(response.body).toEqual({ success: true });
    
    // Verify Prisma delete was called
    expect(mockPrismaService.profile.delete).toHaveBeenCalledWith({
      where: { userId: mockUser.uid },
    });

    // Verify Firebase delete was called (via AuthService which uses admin.auth())
    expect(admin.auth().deleteUser).toHaveBeenCalledWith(mockUser.uid);

    // Verify SQS message was published
    expect(SendMessageCommand).toHaveBeenCalledWith(expect.objectContaining({
      QueueUrl: 'http://localhost/cleanup-queue',
      MessageBody: JSON.stringify({ userId: mockUser.uid }),
    }));
  });

  afterEach(async () => {
    await app.close();
  });
});
