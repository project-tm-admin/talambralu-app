const mockSqsSend = jest.fn();
const mockS3Send = jest.fn();

jest.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: jest.fn().mockImplementation(() => ({ send: mockSqsSend })),
  ReceiveMessageCommand: jest.fn().mockImplementation((args) => args),
  DeleteMessageCommand: jest.fn().mockImplementation((args) => args),
}));

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: mockS3Send })),
  ListObjectsV2Command: jest.fn().mockImplementation((args) => args),
  DeleteObjectsCommand: jest.fn().mockImplementation((args) => args),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CleanupService } from './cleanup.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('CleanupService', () => {
  let service: CleanupService;

  const mockPrisma = {
    profile: {
      findUnique: jest.fn(),
    },
  };

  const mockConfigService = {
    get: (key: string) => {
      const cfg: Record<string, string> = {
        AWS_REGION: 'us-east-1',
        AWS_SQS_CLEANUP_QUEUE_URL: 'http://queue-url',
        AWS_S3_PUBLIC_BUCKET: 'test-bucket',
      };
      return cfg[key];
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockPrisma.profile.findUnique.mockResolvedValue(null); // profile deleted by default

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleanupService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CleanupService>(CleanupService);
  });

  describe('cleanupUserS3Data', () => {
    it('calls ListObjectsV2 for each of the three prefixes', async () => {
      mockS3Send.mockResolvedValue({
        Contents: [],
        NextContinuationToken: undefined,
      });

      await (service as any).cleanupUserS3Data('user-abc');

      const listCalls = mockS3Send.mock.calls;
      expect(listCalls).toHaveLength(3);
      expect(listCalls[0][0]).toMatchObject({
        Bucket: 'test-bucket',
        Prefix: 'profile-photos/user-abc/',
      });
      expect(listCalls[1][0]).toMatchObject({
        Bucket: 'test-bucket',
        Prefix: 'verification-docs/user-abc/',
      });
      expect(listCalls[2][0]).toMatchObject({
        Bucket: 'test-bucket',
        Prefix: 'verification-docs/paystubs/user-abc/',
      });
    });

    it('calls DeleteObjectsCommand with listed keys', async () => {
      mockS3Send.mockImplementation((cmd) => {
        if ('Prefix' in cmd) {
          return Promise.resolve({
            Contents: [{ Key: `${cmd.Prefix}file.jpg` }],
            NextContinuationToken: undefined,
          });
        }
        // DeleteObjectsCommand
        return Promise.resolve({ Errors: [] });
      });

      await (service as any).cleanupUserS3Data('user-abc');

      const deleteCalls = mockS3Send.mock.calls.filter(
        (call) => 'Delete' in call[0],
      );
      expect(deleteCalls).toHaveLength(3);
      expect(deleteCalls[0][0]).toMatchObject({
        Bucket: 'test-bucket',
        Delete: {
          Objects: [{ Key: 'profile-photos/user-abc/file.jpg' }],
          Quiet: false,
        },
      });
    });

    it('skips DeleteObjectsCommand when prefix has no objects', async () => {
      mockS3Send.mockResolvedValue({
        Contents: [],
        NextContinuationToken: undefined,
      });

      await (service as any).cleanupUserS3Data('user-abc');

      const deleteCalls = mockS3Send.mock.calls.filter(
        (call) => 'Delete' in call[0],
      );
      expect(deleteCalls).toHaveLength(0);
    });

    it('throws when DeleteObjectsCommand returns per-object errors', async () => {
      mockS3Send.mockImplementation((cmd) => {
        if ('Prefix' in cmd) {
          return Promise.resolve({
            Contents: [{ Key: 'profile-photos/user-abc/pic.jpg' }],
          });
        }
        return Promise.resolve({
          Errors: [
            { Key: 'profile-photos/user-abc/pic.jpg', Code: 'AccessDenied' },
          ],
        });
      });

      await expect(
        (service as any).cleanupUserS3Data('user-abc'),
      ).rejects.toThrow('S3 DeleteObjects failed');
    });

    it('paginates when NextContinuationToken is present', async () => {
      let listCallCount = 0;
      mockS3Send.mockImplementation((cmd) => {
        if ('Prefix' in cmd) {
          listCallCount++;
          if (listCallCount === 1) {
            return Promise.resolve({
              Contents: [{ Key: 'profile-photos/user-abc/pic1.jpg' }],
              NextContinuationToken: 'token-abc',
            });
          }
          return Promise.resolve({
            Contents: [{ Key: 'profile-photos/user-abc/pic2.jpg' }],
            NextContinuationToken: undefined,
          });
        }
        return Promise.resolve({ Errors: [] });
      });

      await (service as any).deleteObjectsWithPrefix(
        'profile-photos/user-abc/',
      );

      // 2 lists + 2 deletes = 4 total calls for one prefix with 2 pages
      expect(mockS3Send).toHaveBeenCalledTimes(4);
    });
  });

  describe('processMessage', () => {
    const makeMessage = (body: unknown, receiptHandle = 'rh-123') => ({
      Body: JSON.stringify(body),
      MessageId: 'msg-1',
      ReceiptHandle: receiptHandle,
    });

    it('cleans S3 and acks the message on success', async () => {
      mockS3Send.mockResolvedValue({
        Contents: [],
        NextContinuationToken: undefined,
      });
      mockSqsSend.mockResolvedValue({});

      await (service as any).processMessage(
        makeMessage({ userId: 'user-abc' }),
      );

      // Ack (DeleteMessageCommand) was sent
      expect(mockSqsSend).toHaveBeenCalledWith(
        expect.objectContaining({ ReceiptHandle: 'rh-123' }),
      );
    });

    it('acks without S3 cleanup when profile still exists in DB (DB delete failed)', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue({ userId: 'user-abc' });

      await (service as any).processMessage(
        makeMessage({ userId: 'user-abc' }),
      );

      expect(mockS3Send).not.toHaveBeenCalled();
      // Still acks so the message is not left in flight indefinitely
      expect(mockSqsSend).toHaveBeenCalledWith(
        expect.objectContaining({ ReceiptHandle: 'rh-123' }),
      );
    });

    it('throws for message missing userId so it routes to DLQ', async () => {
      await expect(
        (service as any).processMessage(makeMessage({ other: 'field' })),
      ).rejects.toThrow('missing the userId field');

      // Message must NOT have been acked
      expect(mockSqsSend).not.toHaveBeenCalled();
    });

    it('throws when S3 cleanup fails so message routes to DLQ', async () => {
      mockS3Send.mockImplementation((cmd) => {
        if ('Prefix' in cmd) {
          return Promise.resolve({
            Contents: [{ Key: 'profile-photos/user-abc/pic.jpg' }],
          });
        }
        return Promise.resolve({
          Errors: [{ Key: 'pic.jpg', Code: 'AccessDenied' }],
        });
      });

      await expect(
        (service as any).processMessage(makeMessage({ userId: 'user-abc' })),
      ).rejects.toThrow();

      // Message must NOT have been acked
      expect(mockSqsSend).not.toHaveBeenCalledWith(
        expect.objectContaining({ ReceiptHandle: 'rh-123' }),
      );
    });

    it('acks an empty-body message to avoid infinite redelivery', async () => {
      const emptyMsg = {
        Body: '',
        MessageId: 'msg-empty',
        ReceiptHandle: 'rh-empty',
      };
      mockSqsSend.mockResolvedValue({});

      await (service as any).processMessage(emptyMsg);

      expect(mockSqsSend).toHaveBeenCalledWith(
        expect.objectContaining({ ReceiptHandle: 'rh-empty' }),
      );
    });
  });
});
