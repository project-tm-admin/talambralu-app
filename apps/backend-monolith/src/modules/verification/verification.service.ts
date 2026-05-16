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
  RekognitionClient,
  DetectFacesCommand,
} from '@aws-sdk/client-rekognition';
import {
  TextractClient,
  AnalyzeDocumentCommand,
} from '@aws-sdk/client-textract';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class VerificationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(VerificationService.name);
  private readonly sqsClient: SQSClient;
  private readonly rekognitionClient: RekognitionClient;
  private readonly textractClient: TextractClient;
  private readonly s3Client: S3Client;
  private readonly queueUrl: string | undefined;
  private readonly incomeQueueUrl: string | undefined;
  private isPolling = false;
  private activePollPromise: Promise<void> | null = null;
  private activeIncomePollPromise: Promise<void> | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    this.queueUrl = this.configService.get<string>('AWS_SQS_SELFIE_QUEUE_URL');
    this.incomeQueueUrl = this.configService.get<string>(
      'AWS_SQS_INCOME_QUEUE_URL',
    );

    this.sqsClient = new SQSClient({ region });
    this.rekognitionClient = new RekognitionClient({ region });
    this.textractClient = new TextractClient({ region });
    this.s3Client = new S3Client({ region });
  }

  onModuleInit() {
    if (this.queueUrl) {
      this.logger.log(
        `Starting SQS polling for selfie queue: ${this.queueUrl}`,
      );
      this.isPolling = true;
      this.activePollPromise = this.pollQueue(
        this.queueUrl,
        this.processSelfieMessage.bind(this),
      ).catch((e: Error) =>
        this.logger.error(`Selfie polling loop crashed: ${e.message}`),
      );
    } else {
      this.logger.warn(
        'AWS_SQS_SELFIE_QUEUE_URL is not set. Selfie processing is disabled.',
      );
    }

    if (this.incomeQueueUrl) {
      this.logger.log(
        `Starting SQS polling for income queue: ${this.incomeQueueUrl}`,
      );
      this.isPolling = true; // Ensure polling flag is true if either queue starts
      this.activeIncomePollPromise = this.pollQueue(
        this.incomeQueueUrl,
        this.processIncomeMessage.bind(this),
      ).catch((e: Error) =>
        this.logger.error(`Income polling loop crashed: ${e.message}`),
      );
    } else {
      this.logger.warn(
        'AWS_SQS_INCOME_QUEUE_URL is not set. Income processing is disabled.',
      );
    }
  }

  async onModuleDestroy() {
    this.logger.log('Stopping SQS polling...');
    this.isPolling = false;

    const promises: Promise<void>[] = [];
    if (this.activePollPromise) promises.push(this.activePollPromise);
    if (this.activeIncomePollPromise)
      promises.push(this.activeIncomePollPromise);

    if (promises.length > 0) {
      await Promise.all(promises);
    }
    this.logger.log('SQS polling stopped.');
  }

  private async pollQueue(
    queueUrl: string,
    messageHandler: (msg: Message, qUrl: string) => Promise<void>,
  ) {
    while (this.isPolling) {
      try {
        const command = new ReceiveMessageCommand({
          QueueUrl: queueUrl,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 20,
        });

        const response = await this.sqsClient.send(command);

        if (response.Messages && response.Messages.length > 0) {
          for (const message of response.Messages) {
            await messageHandler(message, queueUrl);
          }
        }
      } catch (error: unknown) {
        if (!this.isPolling) break; // Suppress errors if we are shutting down
        const err = error as Error;
        this.logger.error(
          `Error polling SQS queue ${queueUrl}: ${err.message}`,
          err.stack,
        );
        // Wait a bit before retrying on error
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  private async processSelfieMessage(message: Message, queueUrl: string) {
    await this.processMessageBase(
      message,
      queueUrl,
      this.verifyLiveness.bind(this),
    );
  }

  private async processIncomeMessage(message: Message, queueUrl: string) {
    await this.processMessageBase(
      message,
      queueUrl,
      this.verifyIncome.bind(this),
    );
  }

  private async processMessageBase(
    message: Message,
    queueUrl: string,
    verificationFn: (bucket: string, key: string) => Promise<void>,
  ) {
    try {
      if (!message.Body) return;
      const body = JSON.parse(message.Body) as Record<string, unknown>;

      let records = body.Records as Record<string, any>[];

      // If the message is from SNS, unwrap it
      if (body.Type === 'Notification' && typeof body.Message === 'string') {
        const snsMessage = JSON.parse(body.Message) as Record<string, unknown>;
        records = snsMessage.Records as Record<string, any>[];
      }

      if (Array.isArray(records) && records.length > 0) {
        for (const record of records) {
          const eventName = String(record.eventName || '');
          if (eventName.startsWith('ObjectCreated:')) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const bucketName = String(record.s3?.bucket?.name || '');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const rawKey = String(record.s3?.object?.key || '');
            const objectKey = decodeURIComponent(rawKey.replace(/\+/g, ' '));
            await verificationFn(bucketName, objectKey);
          }
        }
      }

      // Delete message after successful processing
      if (message.ReceiptHandle) {
        const deleteCommand = new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        });
        await this.sqsClient.send(deleteCommand);
      }
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Error processing message ${message.MessageId}: ${err.message}`,
        err.stack,
      );
      // Not deleting the message means it will go back to the queue/DLQ after visibility timeout
    }
  }

  private async verifyLiveness(bucket: string, key: string) {
    this.logger.log(`Verifying liveness for s3://${bucket}/${key}`);

    // Key format: verification-docs/{userId}/{fileId}
    const parts = key.split('/');
    if (parts.length < 3 || parts[0] !== 'verification-docs') {
      this.logger.warn(`Invalid object key structure: ${key}`);
      return;
    }

    // Ignore paystubs in the liveness checker
    if (parts[1] === 'paystubs') {
      this.logger.log(`Ignoring paystub object in selfie queue: ${key}`);
      return;
    }

    const userId = parts[1];

    try {
      // Ensure the profile exists before proceeding
      const profile = await this.prisma.profile.findUnique({
        where: { userId },
      });

      if (!profile) {
        this.logger.warn(
          `Profile not found for userId: ${userId}. Skipping verification.`,
        );
        return; // Don't throw, let the message be deleted as it's invalid
      }

      const command = new DetectFacesCommand({
        Image: {
          S3Object: {
            Bucket: bucket,
            Name: key,
          },
        },
        Attributes: ['DEFAULT'],
      });

      const response = await this.rekognitionClient.send(command);

      // Check if there is at least one face with high confidence
      const faceDetails = response.FaceDetails;
      const isFaceVerified = !!(
        faceDetails &&
        faceDetails.length > 0 &&
        faceDetails[0].Confidence &&
        faceDetails[0].Confidence > 90
      );

      if (isFaceVerified) {
        this.logger.log(`Face verified for user ${userId}.`);
        await this.prisma.profile.update({
          where: { userId },
          data: { isFaceVerified: true },
        });
      } else {
        this.logger.log(
          `Face NOT verified for user ${userId}. No face found or confidence too low.`,
        );
      }
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Rekognition/DB error for user ${userId}: ${err.message}`,
      );
      throw error; // Rethrow to prevent SQS deletion
    }
  }

  private async verifyIncome(bucket: string, key: string) {
    this.logger.log(`Verifying income for s3://${bucket}/${key}`);

    // Key format: verification-docs/paystubs/{userId}/{fileId}
    const parts = key.split('/');
    // Check if it's a paystub (which has an extra path segment vs selfies)
    // S3 object keys might look like: verification-docs/{userId}/{fileId} for selfies
    // and verification-docs/paystubs/{userId}/{fileId} for paystubs
    let userId = '';

    if (parts.length >= 4 && parts[1] === 'paystubs') {
      userId = parts[2];
    } else {
      this.logger.warn(`Invalid object key structure for income: ${key}`);
      return;
    }

    try {
      const profile = await this.prisma.profile.findUnique({
        where: { userId },
      });

      if (!profile) {
        this.logger.warn(
          `Profile not found for userId: ${userId}. Skipping income verification.`,
        );
        return;
      }

      const analyzeCommand = new AnalyzeDocumentCommand({
        Document: {
          S3Object: {
            Bucket: bucket,
            Name: key,
          },
        },
        FeatureTypes: ['TABLES', 'FORMS'],
      });

      const response = await this.textractClient.send(analyzeCommand);

      // MVP parsing: If Textract succeeded and returned blocks, mark as verified with a mock bracket.
      const hasBlocks = response.Blocks && response.Blocks.length > 0;

      if (hasBlocks) {
        this.logger.log(
          `Income verified for user ${userId}. Deleting document...`,
        );

        // Delete the document from S3 first to ensure no sensitive data leaks if DB update fails
        const deleteCommand = new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        });
        await this.s3Client.send(deleteCommand);
        this.logger.log(`Deleted verified paystub s3://${bucket}/${key}`);

        await this.prisma.profile.update({
          where: { userId },
          data: {
            isIncomeVerified: true,
            incomeBracket: 'Verified',
          },
        });
        this.logger.log(`Database updated for user ${userId}.`);
      } else {
        this.logger.log(
          `Income NOT verified for user ${userId}. No data extracted.`,
        );
      }
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Textract/DB error for user ${userId}: ${err.message}`);
      throw error;
    }
  }
}
