import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationService } from './communication.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('CommunicationService', () => {
  let service: CommunicationService;
  let prisma: PrismaService;

  const mockPrisma = {
    message: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunicationService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CommunicationService>(CommunicationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveMessage', () => {
    it('should create a message', async () => {
      const dto = { matchId: 'uuid', senderId: 'user1', content: 'hello' };
      mockPrisma.message.create.mockResolvedValue({ id: 'msg1', ...dto });

      const result = await service.saveMessage(dto.matchId, dto.senderId, dto.content);

      expect(prisma.message.create).toHaveBeenCalledWith({
        data: dto,
      });
      expect(result.id).toBe('msg1');
    });
  });

  describe('getMessages', () => {
    it('should return messages', async () => {
      mockPrisma.message.findMany.mockResolvedValue([{ id: 'msg1' }]);

      const result = await service.getMessages('uuid');

      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: { matchId: 'uuid' },
        take: 50,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });
});
