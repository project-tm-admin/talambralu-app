import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

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
}
