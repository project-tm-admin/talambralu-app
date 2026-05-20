import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaReplicaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaReplicaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_REPLICA_URL || process.env.DATABASE_URL,
        },
      },
    });
    if (!process.env.DATABASE_REPLICA_URL) {
      this.logger.warn(
        'DATABASE_REPLICA_URL is not set — replica service is falling back to primary DATABASE_URL',
      );
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
