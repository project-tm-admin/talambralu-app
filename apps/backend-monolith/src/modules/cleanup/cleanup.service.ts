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

@Injectable()
export class CleanupService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CleanupService.name);
  private readonly sqsClient: SQSClient;
  private readonly s3Client: S3Client;
  private readonly queueUrl: string | undefined;
  private readonly mediaBucket: string;
  private isPolling = false;
  private activePollPromise: Promise<void> | null = null;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    this.queueUrl = this.configService.get<string>('AWS_SQS_CLEANUP_QUEUE_URL');
    this.mediaBucket = this.configService.get<string>('AWS_S3_PUBLIC_BUCKET') || '';

    this.sqsClient = new SQSClient({ region });
    this.s3Client = new S3Client({ region });
  }

  onModuleInit() {
    if (this.queueUrl) {
      this.logger.log(`Starting SQS polling for cleanup queue: ${this.queueUrl}`);
      this.isPolling = true;
      this.activePollPromise = this.pollQueue().catch((e: Error) =>
        this.logger.error(`Cleanup polling loop crashed: ${e.message}`),
      );
    } else {
      this.logger.warn(
        'AWS_SQS_CLEANUP_QUEUE_URL is not set. Account cleanup is disabled.',
      );
    }
  }

  async OnModuleDestroy() {
    this.logger.log('Stopping SQS polling for cleanup...');
    this.isPolling = false;
    if (this.activePollPromise) {
      await this.activePollPromise;
    }
    this.logger.log('Cleanup polling stopped.');
  }

  // Mandatory implementation for OnModuleDestroy interface
  async onModuleDestroy() {
    await this.OnModuleDestroy();
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

        if (response.Messages && response.Messages.length > 0) {
          for (const message of response.Messages) {
            await this.processMessage(message);
          }
        }
      } catch (error: unknown) {
        if (!this.isPolling) break;
        const err = error as Error;
        this.logger.error(
          `Error polling cleanup queue: ${err.message}`,
          err.stack,
        );
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  private async processMessage(message: Message) {
    try {
      if (!message.Body) return;
      const body = JSON.parse(message.Body) as { userId?: string };
      const userId = body.userId;

      if (!userId) {
        this.logger.warn(`Received cleanup message without userId: ${message.MessageId}`);
      } else {
        await this.cleanupUserS3Data(userId);
      }

      if (message.ReceiptHandle) {
        await this.sqsClient.send(
          new DeleteMessageCommand({
            QueueUrl: this.queueUrl!,
            ReceiptHandle: message.ReceiptHandle,
          }),
        );
      }
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Error processing cleanup message ${message.MessageId}: ${err.message}`,
      );
    }
  }

  private async cleanupUserS3Data(userId: string) {
    this.logger.log(`Starting S3 cleanup for user: ${userId}`);

    const prefixes = [`profile-photos/${userId}/`, `verification-docs/${userId}/` , `verification-docs/paystubs/${userId}/` ];

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
            Quiet: true,
          },
        });

        await this.s3Client.send(deleteCommand);
        this.logger.log(`Deleted ${objectsToDelete.length} objects with prefix: ${prefix}`);
      }

      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);
  }
}
