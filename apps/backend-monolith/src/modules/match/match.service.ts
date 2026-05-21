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

  async passMatch(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new BadRequestException('You cannot pass on yourself');
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
      if (existingMatch.status === MatchStatus.ACCEPTED) {
        throw new ConflictException(
          'Cannot pass on an active match — unmatch first',
        );
      }

      if (existingMatch.status === MatchStatus.PASSED) {
        return existingMatch;
      }

      // D1: if the other party sent a PENDING interest to the caller, treat as DECLINE
      const newStatus =
        existingMatch.status === MatchStatus.PENDING &&
        existingMatch.receiverId === senderId
          ? MatchStatus.DECLINED
          : MatchStatus.PASSED;

      return this.prisma.match.update({
        where: { id: existingMatch.id },
        data: { status: newStatus },
      });
    }

    try {
      return await this.prisma.match.create({
        data: {
          senderId,
          receiverId,
          status: MatchStatus.PASSED,
        },
      });
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2002'
      ) {
        // Concurrent duplicate create — return idempotently
        return this.prisma.match.findFirst({
          where: {
            OR: [
              { senderId, receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          },
        });
      }
      throw err;
    }
  }

  async getInteractedUserIds(userId: string): Promise<string[]> {
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      select: { senderId: true, receiverId: true },
    });

    const ids = new Set<string>();
    matches.forEach((m) => {
      ids.add(m.senderId);
      ids.add(m.receiverId);
    });
    return Array.from(ids);
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
