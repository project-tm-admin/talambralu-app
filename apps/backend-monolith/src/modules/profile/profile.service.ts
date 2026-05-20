import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { DiscoveryQueryDto } from './dto/discovery-query.dto';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProfileService implements OnModuleInit {
  private sqsClient: SQSClient;
  private cleanupQueueUrl: string | undefined;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  onModuleInit() {
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    this.cleanupQueueUrl = this.configService.get<string>(
      'AWS_SQS_CLEANUP_QUEUE_URL',
    );
    this.sqsClient = new SQSClient({ region });
  }

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
      throw new BadRequestException(
        'minAge must be less than or equal to maxAge',
      );
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

  async deleteAccount(userId: string) {
    // 1. Publish SQS message for S3 cleanup
    if (this.cleanupQueueUrl) {
      const command = new SendMessageCommand({
        QueueUrl: this.cleanupQueueUrl,
        MessageBody: JSON.stringify({ userId }),
      });
      await this.sqsClient.send(command);
    }

    // 2. Delete from database (cascades automatically)
    await this.prisma.profile.delete({
      where: { userId },
    });

    // 3. Delete from Firebase Auth
    try {
      await this.authService.deleteUser(userId);
    } catch (error) {
      // If user is already deleted or not found in Firebase, we should log and continue
      console.error(`Error deleting Firebase user ${userId}:`, error);
    }

    return { success: true };
  }
}
