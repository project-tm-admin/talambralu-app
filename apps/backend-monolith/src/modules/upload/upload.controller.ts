import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreatePresignedPostDto } from './dto/create-presigned-post.dto';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';

@Controller('v1/upload')
@UseGuards(FirebaseAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned-post')
  async createPresignedPost(
    @CurrentUser() user: { uid: string },
    @Body() dto: CreatePresignedPostDto,
  ) {
    return this.uploadService.generatePresignedPost(user.uid, dto.purpose, dto.contentType);
  }
}
