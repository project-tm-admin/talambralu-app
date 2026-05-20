import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/common/prisma/prisma.service';
import * as admin from 'firebase-admin';

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest
      .fn()
      .mockResolvedValue({ uid: 'test-user-id', email: 'test@example.com' }),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  }),
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
    applicationDefault: jest.fn().mockReturnValue({}),
  },
  apps: [],
}));

// Expose the send mock so we can assert it was called — not just the constructor
let sqsSendMock: jest.Mock;
jest.mock('@aws-sdk/client-sqs', () => {
  const send = jest.fn().mockResolvedValue({ MessageId: 'test-message-id' });
  sqsSendMock = send;
  return {
    SQSClient: jest.fn().mockImplementation(() => ({ send })),
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
    jest.clearAllMocks();
    sqsSendMock.mockResolvedValue({ MessageId: 'test-message-id' });
    mockPrismaService.profile.delete.mockResolvedValue({ userId: mockUser.uid });

    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_SQS_CLEANUP_QUEUE_URL = 'http://localhost/cleanup-queue';

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

  afterEach(async () => {
    await app.close();
  });

  it('DELETE /v1/profiles/me returns 200 and cleans up account', async () => {
    const response = await request(app.getHttpServer())
      .delete('/v1/profiles/me')
      .set('Authorization', 'Bearer dummy-token')
      .expect(200);

    expect(response.body).toEqual({ success: true });

    // DB delete was called
    expect(mockPrismaService.profile.delete).toHaveBeenCalledWith({
      where: { userId: mockUser.uid },
    });

    // Firebase delete was called
    expect(admin.auth().deleteUser).toHaveBeenCalledWith(mockUser.uid);

    // SQS send was actually called (not just the constructor)
    expect(sqsSendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        QueueUrl: 'http://localhost/cleanup-queue',
        MessageBody: JSON.stringify({ userId: mockUser.uid }),
      }),
    );
  });

  it('DELETE /v1/profiles/me returns 404 when profile does not exist', async () => {
    const { Prisma } = await import('@prisma/client');
    mockPrismaService.profile.delete.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: 'test',
        meta: {},
      }),
    );

    await request(app.getHttpServer())
      .delete('/v1/profiles/me')
      .set('Authorization', 'Bearer dummy-token')
      .expect(404);
  });
});
