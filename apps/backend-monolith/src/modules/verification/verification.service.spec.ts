import { Test, TestingModule } from '@nestjs/testing';
import { VerificationService } from './verification.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { mockClient } from 'aws-sdk-client-mock';
import { SQSClient } from '@aws-sdk/client-sqs';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import {
  RekognitionClient,
  DetectFacesCommand,
} from '@aws-sdk/client-rekognition';
import {
  TextractClient,
  AnalyzeDocumentCommand,
} from '@aws-sdk/client-textract';

describe('VerificationService', () => {
  let service: VerificationService;
  let prismaService: PrismaService;
  const sqsMock = mockClient(SQSClient);
  const rekognitionMock = mockClient(RekognitionClient);
  const textractMock = mockClient(TextractClient);
  const s3Mock = mockClient(S3Client);

  beforeEach(async () => {
    sqsMock.reset();
    rekognitionMock.reset();
    textractMock.reset();
    s3Mock.reset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'AWS_REGION') return 'us-east-1';
              if (key === 'AWS_SQS_SELFIE_QUEUE_URL')
                return 'https://sqs.us-east-1.amazonaws.com/123/queue';
              if (key === 'AWS_SQS_INCOME_QUEUE_URL')
                return 'https://sqs.us-east-1.amazonaws.com/123/income-queue';
              return null;
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            profile: {
              findUnique: jest
                .fn()
                .mockResolvedValue({ id: 'uuid', userId: 'user123' }),
              update: jest.fn().mockResolvedValue({}),
            },
          },
        },
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should verify liveness successfully and update profile', async () => {
    rekognitionMock.on(DetectFacesCommand).resolves({
      FaceDetails: [{ Confidence: 95 }],
    });

    await service['verifyLiveness'](
      'my-bucket',
      'verification-docs/user123/file.jpg',
    );

    expect(prismaService.profile.update).toHaveBeenCalledWith({
      where: { userId: 'user123' },
      data: { isFaceVerified: true },
    });
  });

  it('should not update profile if confidence is low', async () => {
    rekognitionMock.on(DetectFacesCommand).resolves({
      FaceDetails: [{ Confidence: 80 }],
    });

    await service['verifyLiveness'](
      'my-bucket',
      'verification-docs/user123/file.jpg',
    );

    expect(prismaService.profile.update).not.toHaveBeenCalled();
  });

  it('should verify income successfully, update profile, and delete S3 object', async () => {
    textractMock.on(AnalyzeDocumentCommand).resolves({
      Blocks: [{ BlockType: 'PAGE' }],
    });
    s3Mock.on(DeleteObjectCommand).resolves({});

    await service['verifyIncome'](
      'my-bucket',
      'verification-docs/paystubs/user123/file.jpg',
    );

    expect(prismaService.profile.update).toHaveBeenCalledWith({
      where: { userId: 'user123' },
      data: { isIncomeVerified: true, incomeBracket: 'Verified' },
    });
    expect(s3Mock.calls().length).toBe(1);
  });

  it('should not update income if no blocks returned', async () => {
    textractMock.on(AnalyzeDocumentCommand).resolves({
      Blocks: [],
    });

    await service['verifyIncome'](
      'my-bucket',
      'verification-docs/paystubs/user123/file.jpg',
    );

    expect(prismaService.profile.update).not.toHaveBeenCalledWith(
      expect.objectContaining({ data: { isIncomeVerified: true } }),
    );
    expect(s3Mock.calls().length).toBe(0);
  });
});
