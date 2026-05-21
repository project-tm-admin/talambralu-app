import {
  Injectable,
  BadRequestException,
  OnModuleInit,
  InternalServerErrorException,
  NotFoundException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { DiscoveryQueryDto } from './dto/discovery-query.dto';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { AuthService } from '../auth/auth.service';
import { MatchService } from '../match/match.service';

@Injectable()
export class ProfileService implements OnModuleInit {
  private readonly logger = new Logger(ProfileService.name);
  private sqsClient: SQSClient;
  private cleanupQueueUrl: string | undefined;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private authService: AuthService,
    @Inject(forwardRef(() => MatchService))
    private matchService: MatchService,
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

  async updatePhotos(userId: string, photos: string[]) {
    return this.prisma.profile.update({
      where: { userId },
      data: { photos },
    });
  }

  async getProfileByUserId(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId },
    });
  }

  async getProfileById(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async findManyByIds(userIds: string[]) {
    return this.prisma.profile.findMany({
      where: { userId: { in: userIds } },
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

    const interactedIds = await this.matchService.getInteractedUserIds(userId);
    const excludedUserIds = new Set<string>([userId, ...interactedIds]);

    const where: Prisma.ProfileWhereInput = {
      userId: { notIn: Array.from(excludedUserIds) },
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
    if (!this.cleanupQueueUrl) {
      throw new InternalServerErrorException(
        'Account deletion is unavailable: cleanup queue is not configured',
      );
    }

    // 1. Publish SQS message for S3 cleanup before DB delete (per spec) so the
    //    cleanup event is not lost if the DB delete succeeds but SQS publish fails.
    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: this.cleanupQueueUrl,
        MessageBody: JSON.stringify({ userId }),
      }),
    );

    // 2. Delete from database (cascades to Match, Message, UserSubscription)
    try {
      await this.prisma.profile.delete({ where: { userId } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Profile not found');
      }
      throw error;
    }

    // 3. Delete from Firebase Auth — log and continue if this fails; the DB
    //    record is already gone so the account cannot be re-authenticated.
    try {
      await this.authService.deleteUser(userId);
    } catch (error) {
      this.logger.error(`Failed to delete Firebase user ${userId}:`, error);
    }

    return { success: true };
  }
}
