import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { FilePurpose } from './dto/create-presigned-post.dto';

describe('UploadController', () => {
  let controller: UploadController;
  let service: UploadService;

  const mockUploadService = {
    generatePresignedPost: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPresignedPost', () => {
    it('should return a presigned post object', async () => {
      const user = { uid: 'firebase-uid' };
      const dto = {
        purpose: FilePurpose.PROFILE_PHOTO,
        contentType: 'image/jpeg',
      };
      const expectedResult = {
        url: 'http://test',
        fields: { key: 'test/key' },
        key: 'test/key',
      };

      mockUploadService.generatePresignedPost.mockResolvedValue(expectedResult);

      const result = await controller.createPresignedPost(user, dto);

      expect(result).toEqual(expectedResult);
      expect(service.generatePresignedPost).toHaveBeenCalledWith(
        user.uid,
        dto.purpose,
        dto.contentType,
      );
    });
  });
});
