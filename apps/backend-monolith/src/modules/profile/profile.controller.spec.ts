import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Gender } from '@prisma/client';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockProfileService = {
    upsertProfile: jest.fn(),
    getProfileByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upsert', () => {
    it('should upsert a profile', async () => {
      const user = { uid: 'firebase-uid' };
      const dto: UpsertProfileDto = {
        fullName: 'John Doe',
        dob: '1990-01-01',
        gender: Gender.MALE,
      };

      const expectedProfile = { id: 'uuid', userId: user.uid, ...dto };
      mockProfileService.upsertProfile.mockResolvedValue(expectedProfile);

      const result = await controller.upsert(user, dto);

      expect(result).toEqual(expectedProfile);
      expect(service.upsertProfile).toHaveBeenCalledWith(user.uid, dto);
    });
  });

  describe('getMe', () => {
    it('should return my profile', async () => {
      const user = { uid: 'firebase-uid' };
      const expectedProfile = {
        id: 'uuid',
        userId: user.uid,
        fullName: 'John Doe',
      };
      mockProfileService.getProfileByUserId.mockResolvedValue(expectedProfile);

      const result = await controller.getMe(user);

      expect(result).toEqual(expectedProfile);
      expect(service.getProfileByUserId).toHaveBeenCalledWith(user.uid);
    });
  });
});
