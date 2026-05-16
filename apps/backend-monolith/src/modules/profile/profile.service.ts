import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { DiscoveryQueryDto } from './dto/discovery-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async upsertProfile(userId: string, dto: UpsertProfileDto) {
    return this.prisma.profile.upsert({
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
  }

  async getProfileByUserId(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId },
    });
  }

  async findDiscoveryProfiles(userId: string, query: DiscoveryQueryDto) {
    const {
      skip = 0,
      take = 20,
      gender,
      minAge,
      maxAge,
      isFaceVerified,
      isIncomeVerified,
      isWorkVerified,
    } = query;

    const where: Prisma.ProfileWhereInput = {
      userId: { not: userId },
    };

    if (gender) {
      where.gender = gender;
    }

    if (isFaceVerified !== undefined) {
      where.isFaceVerified = isFaceVerified;
    }

    if (isIncomeVerified !== undefined) {
      where.isIncomeVerified = isIncomeVerified;
    }

    if (isWorkVerified !== undefined) {
      where.isWorkVerified = isWorkVerified;
    }

    if (minAge && maxAge && minAge > maxAge) {
      throw new BadRequestException('minAge must be less than or equal to maxAge');
    }

    if (minAge || maxAge) {
      const now = new Date();
      const dobFilter: Prisma.DateTimeFilter = {};
      if (minAge) {
        // Person must be born on or before this date to be at least minAge
        const maxDob = new Date(
          now.getFullYear() - minAge,
          now.getMonth(),
          now.getDate(),
        );
        dobFilter.lte = maxDob;
      }
      if (maxAge) {
        // Person must be born on or after this date to be at most maxAge
        const minDob = new Date(
          now.getFullYear() - maxAge - 1,
          now.getMonth(),
          now.getDate() + 1,
        );
        dobFilter.gte = minDob;
      }
      where.dob = dobFilter;
    }

    const [data, total] = await Promise.all([
      this.prisma.profile.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.profile.count({ where }),
    ]);

    return { data, total };
  }
}
