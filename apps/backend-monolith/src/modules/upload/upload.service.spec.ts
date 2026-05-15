import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { ConfigService } from '@nestjs/config';
import { FilePurpose } from './dto/create-presigned-post.dto';

// Mock the AWS SDK
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn(),
  };
});
jest.mock('@aws-sdk/s3-presigned-post', () => {
  return {
    createPresignedPost: jest.fn().mockResolvedValue({
      url: 'https://mocked-presigned-url.com',
      fields: { key: 'mocked-key' },
    }),
  };
});

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'AWS_REGION') return 'us-east-1';
              if (key === 'AWS_S3_PUBLIC_BUCKET') return 'public-bucket';
              if (key === 'AWS_S3_PRIVATE_BUCKET') return 'private-bucket';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generatePresignedPost', () => {
    it('should generate a presigned POST for a profile photo', async () => {
      const userId = 'firebase-uid';
      const result = await service.generatePresignedPost(userId, FilePurpose.PROFILE_PHOTO, 'image/jpeg');

      expect(result.url).toBe('https://mocked-presigned-url.com');
      expect(result.key).toContain('profile-photos/firebase-uid/');
    });

    it('should generate a presigned POST for a verification doc', async () => {
      const userId = 'firebase-uid';
      const result = await service.generatePresignedPost(userId, FilePurpose.VERIFICATION_DOC, 'application/pdf');

      expect(result.url).toBe('https://mocked-presigned-url.com');
      expect(result.key).toContain('verification-docs/firebase-uid/');
    });
  });
});
