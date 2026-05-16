import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { ConfigService } from '@nestjs/config';
import { FilePurpose } from './dto/create-presigned-post.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly publicBucket: string;
  private readonly privateBucket: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const publicBucket = this.configService.get<string>('AWS_S3_PUBLIC_BUCKET');
    const privateBucket = this.configService.get<string>(
      'AWS_S3_PRIVATE_BUCKET',
    );

    if (!region || !publicBucket || !privateBucket) {
      throw new InternalServerErrorException('AWS configuration is missing');
    }

    this.s3Client = new S3Client({ region });
    this.publicBucket = publicBucket;
    this.privateBucket = privateBucket;
  }

  async generatePresignedPost(
    userId: string,
    purpose: FilePurpose,
    contentType: string,
  ): Promise<{ url: string; fields: Record<string, string>; key: string }> {
    const isPrivate = purpose === FilePurpose.VERIFICATION_DOC;
    const bucket = isPrivate ? this.privateBucket : this.publicBucket;
    const prefix = isPrivate ? 'verification-docs' : 'profile-photos';

    const fileId = uuidv4();
    const key = `${prefix}/${userId}/${fileId}`;

    // S3 Pre-signed POST allows enforcing size limits and content-type
    const { url, fields } = await createPresignedPost(this.s3Client, {
      Bucket: bucket,
      Key: key,
      Conditions: [
        ['content-length-range', 0, 10485760], // Max 10MB
        ['eq', '$Content-Type', contentType],
      ],
      Fields: {
        'Content-Type': contentType,
      },
      Expires: 90, // 90 seconds expiry
    });

    return { url, fields, key };
  }
}
