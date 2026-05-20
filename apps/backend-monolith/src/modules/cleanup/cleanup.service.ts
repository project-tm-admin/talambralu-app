import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from '@aws-sdk/client-sqs';
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  ObjectIdentifier,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CleanupService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CleanupService.name);
  private readonly sqsClient: SQSClient;
  private readonly s3Client: S3Client;
  private readonly queueUrl: string | undefined;
  private readonly mediaBucket: string;
  private isPolling = false;
  private activePollPromise: Promise<void> | null = null;
  private retryDelay = 1000;
  private readonly maxRetryDelay = 60000;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    this.queueUrl = this.configService.get<string>('AWS_SQS_CLEANUP_QUEUE_URL');
    this.mediaBucket =
      this.configService.get<string>('AWS_S3_PUBLIC_BUCKET') || '';

    this.sqsClient = new SQSClient({ region });
    this.s3Client = new S3Client({ region });
  }

  onModuleInit() {
    if (!this.mediaBucket) {
      this.logger.error(
        'FATAL: AWS_S3_PUBLIC_BUCKET is not set. S3 cleanup will not function.',
      );
    }
    if (this.queueUrl) {
      this.logger.log(
        `Starting SQS polling for cleanup queue: ${this.queueUrl}`,
      );
      this.startPolling();
    } else {
      this.logger.warn(
        'AWS_SQS_CLEANUP_QUEUE_URL is not set. Account cleanup is disabled.',
      );
    }
  }

  async onModuleDestroy() {
    this.logger.log('Stopping SQS polling for cleanup...');
    this.isPolling = false;
    if (this.activePollPromise) {
      await this.activePollPromise;
    }
    this.logger.log('Cleanup polling stopped.');
  }

  private startPolling() {
    this.isPolling = true;
    this.activePollPromise = this.pollQueue().catch((e: Error) => {
      this.logger.error(
        `Cleanup polling loop crashed: ${e.message}. Restarting in 5s...`,
      );
      setTimeout(() => {
        if (this.isPolling) this.startPolling();
      }, 5000);
    });
  }

  private async pollQueue() {
    while (this.isPolling) {
      try {
        const command = new ReceiveMessageCommand({
          QueueUrl: this.queueUrl,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 20,
        });

        const response = await this.sqsClient.send(command);
        this.retryDelay = 1000;

        for (const message of response.Messages ?? []) {
          try {
            await this.processMessage(message);
          } catch (msgErr: unknown) {
            // Message-level failure: log and do NOT ack — SQS will redeliver, eventually DLQ
            this.logger.error(
              `Failed to process cleanup message ${message.MessageId}: ${(msgErr as Error).message}`,
            );
          }
        }
      } catch (error: unknown) {
        if (!this.isPolling) break;
        const err = error as Error;
        this.logger.error(
          `Error polling cleanup queue: ${err.message}`,
          err.stack,
        );
        const jitter = Math.random() * 1000;
        await new Promise((resolve) =>
          setTimeout(resolve, this.retryDelay + jitter),
        );
        this.retryDelay = Math.min(this.retryDelay * 2, this.maxRetryDelay);
      }
    }
  }

  private async processMessage(message: Message) {
    if (!message.Body) {
      // Genuinely empty — ack to avoid infinite DLQ churn on a structurally broken message
      this.logger.warn(
        `Received empty cleanup message body: ${message.MessageId}`,
      );
      await this.ackMessage(message);
      return;
    }

    const body = JSON.parse(message.Body) as { userId?: string };
    const userId = body.userId;

    if (!userId) {
      // Malformed publish — throw so the message goes to DLQ after maxReceiveCount
      throw new Error(
        `Cleanup message ${message.MessageId} is missing the userId field`,
      );
    }

    // Guard: if the profile still exists the DB delete failed — skip S3 cleanup to
    // protect the live user's data. The next successful DELETE call will enqueue a new message.
    const profileExists = await this.prisma.profile.findUnique({
      where: { userId },
      select: { userId: true },
    });
    if (profileExists) {
      this.logger.warn(
        `Profile ${userId} still exists in DB — DB deletion failed, skipping S3 cleanup`,
      );
      await this.ackMessage(message);
      return;
    }

    if (!this.mediaBucket) {
      throw new Error(
        'AWS_S3_PUBLIC_BUCKET is not configured — cannot perform S3 cleanup',
      );
    }

    await this.cleanupUserS3Data(userId);

    // Only ack after confirmed successful cleanup
    await this.ackMessage(message);
  }

  private async ackMessage(message: Message) {
    if (message.ReceiptHandle) {
      await this.sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: this.queueUrl!,
          ReceiptHandle: message.ReceiptHandle,
        }),
      );
    }
  }

  private async cleanupUserS3Data(userId: string) {
    this.logger.log(`Starting S3 cleanup for user: ${userId}`);

    // NOTE: Both verification-docs/{userId}/ and verification-docs/paystubs/{userId}/
    // are included pending confirmation of the actual S3 key hierarchy. See deferred-work.md.
    const prefixes = [
      `profile-photos/${userId}/`,
      `verification-docs/${userId}/`,
      `verification-docs/paystubs/${userId}/`,
    ];

    for (const prefix of prefixes) {
      await this.deleteObjectsWithPrefix(prefix);
    }

    this.logger.log(`Completed S3 cleanup for user: ${userId}`);
  }

  private async deleteObjectsWithPrefix(prefix: string) {
    let continuationToken: string | undefined;

    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: this.mediaBucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      const listResponse = await this.s3Client.send(listCommand);

      if (listResponse.Contents && listResponse.Contents.length > 0) {
        const objectsToDelete: ObjectIdentifier[] = listResponse.Contents.map(
          (obj) => ({ Key: obj.Key }),
        );

        const deleteCommand = new DeleteObjectsCommand({
          Bucket: this.mediaBucket,
          Delete: {
            Objects: objectsToDelete,
            Quiet: false,
          },
        });

        const deleteResponse = await this.s3Client.send(deleteCommand);

        if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
          const errorKeys = deleteResponse.Errors.map((e) => e.Key).join(', ');
          throw new Error(`S3 DeleteObjects failed for keys: ${errorKeys}`);
        }

        this.logger.log(
          `Deleted ${objectsToDelete.length} objects with prefix: ${prefix}`,
        );
      }

      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);
  }
}
