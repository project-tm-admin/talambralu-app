import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MatchStatus } from '@prisma/client';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async createInterest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new BadRequestException('You cannot express interest in yourself');
    }

    const existingMatch = await this.prisma.match.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existingMatch) {
      if (existingMatch.status === MatchStatus.DECLINED) {
        await this.prisma.match.delete({ where: { id: existingMatch.id } });
      } else {
        throw new ConflictException(
          'Interest already exists between these users',
        );
      }
    }

    return this.prisma.match.create({
      data: {
        senderId,
        receiverId,
        status: MatchStatus.PENDING,
      },
    });
  }

  async acceptInterest(userId: string, matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.receiverId !== userId) {
      throw new ForbiddenException('You can only accept interests sent to you');
    }

    if (match.status !== MatchStatus.PENDING) {
      throw new BadRequestException('Interest is no longer pending');
    }

    return this.prisma.match.update({
      where: { id: matchId },
      data: { status: MatchStatus.ACCEPTED },
    });
  }

  async declineInterest(userId: string, matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.receiverId !== userId) {
      throw new ForbiddenException(
        'You can only decline interests sent to you',
      );
    }

    if (match.status !== MatchStatus.PENDING) {
      throw new BadRequestException('Interest is no longer pending');
    }

    return this.prisma.match.update({
      where: { id: matchId },
      data: { status: MatchStatus.DECLINED },
    });
  }

  async getPendingInterests(userId: string) {
    return this.prisma.match.findMany({
      where: {
        receiverId: userId,
        status: MatchStatus.PENDING,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMatches(userId: string) {
    return this.prisma.match.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: MatchStatus.ACCEPTED,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async isUserInMatch(userId: string, matchId: string): Promise<boolean> {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match || match.status !== MatchStatus.ACCEPTED) {
      return false;
    }

    return match.senderId === userId || match.receiverId === userId;
  }
}
