import { Test, TestingModule } from '@nestjs/testing';
import { VerificationService } from './verification.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { mockClient } from 'aws-sdk-client-mock';
import { SQSClient } from '@aws-sdk/client-sqs';
import {
  RekognitionClient,
  DetectFacesCommand,
} from '@aws-sdk/client-rekognition';

describe('VerificationService', () => {
  let service: VerificationService;
  let prismaService: PrismaService;
  const sqsMock = mockClient(SQSClient);
  const rekognitionMock = mockClient(RekognitionClient);

  beforeEach(async () => {
    sqsMock.reset();
    rekognitionMock.reset();

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
              return null;
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            profile: {
              findUnique: jest.fn().mockResolvedValue({ id: 'uuid', userId: 'user123' }),
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await service['verifyLiveness'](
      'my-bucket',
      'verification-docs/user123/file.jpg',
    );

    expect(prismaService.profile.update).not.toHaveBeenCalled();
  });
});
