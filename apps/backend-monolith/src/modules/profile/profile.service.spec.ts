import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Gender } from '@prisma/client';

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: PrismaService;

  const mockPrismaService = {
    profile: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upsertProfile', () => {
    it('should upsert a profile', async () => {
      const userId = 'firebase-uid';
      const dto = {
        fullName: 'John Doe',
        dob: '1990-01-01',
        gender: Gender.MALE,
      };

      const expectedProfile = {
        id: 'uuid',
        userId,
        ...dto,
        dob: new Date(dto.dob),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.profile.upsert.mockResolvedValue(expectedProfile);

      const result = await service.upsertProfile(userId, dto);

      expect(result).toEqual(expectedProfile);
      expect(prisma.profile.upsert).toHaveBeenCalledWith({
        where: { userId },
        create: {
          userId,
          fullName: dto.fullName,
          dob: new Date(dto.dob),
          gender: dto.gender,
        },
        update: {
          fullName: dto.fullName,
          dob: new Date(dto.dob),
          gender: dto.gender,
        },
      });
    });
  });

  describe('getProfileByUserId', () => {
    it('should return a profile if found', async () => {
      const userId = 'firebase-uid';
      const expectedProfile = {
        id: 'uuid',
        userId,
        fullName: 'John Doe',
        dob: new Date(),
        gender: Gender.MALE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.profile.findUnique.mockResolvedValue(expectedProfile);

      const result = await service.getProfileByUserId(userId);

      expect(result).toEqual(expectedProfile);
      expect(prisma.profile.findUnique).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('should return null if profile not found', async () => {
      const userId = 'firebase-uid';
      mockPrismaService.profile.findUnique.mockResolvedValue(null);

      const result = await service.getProfileByUserId(userId);

      expect(result).toBeNull();
    });
  });
});
