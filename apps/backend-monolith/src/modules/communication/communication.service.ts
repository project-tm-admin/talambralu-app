import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CommunicationService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(matchId: string, senderId: string, content: string) {
    return this.prisma.message.create({
      data: {
        matchId,
        senderId,
        content,
      },
    });
  }

  async getMessages(matchId: string, limit = 50, before?: string) {
    return this.prisma.message.findMany({
      where: {
        matchId,
        ...(before && { createdAt: { lt: new Date(before) } }),
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
