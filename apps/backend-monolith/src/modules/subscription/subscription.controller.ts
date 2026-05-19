import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { RevenueCatWebhookDto } from './dto/revenuecat-webhook.dto';
import { SubscriptionService } from './subscription.service';

@Controller('v1')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('webhooks/revenuecat')
  @Public()
  @HttpCode(HttpStatus.OK)
  async handleRevenueCatWebhook(
    @Headers('authorization') authHeader: string,
    @Body() body: RevenueCatWebhookDto,
  ) {
    const expectedSecret = process.env.REVENUECAT_WEBHOOK_SECRET;
    if (!expectedSecret || !authHeader) {
      throw new UnauthorizedException({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid webhook signature',
          details: {},
        },
      });
    }
    const expectedBuf = Buffer.from(expectedSecret);
    const receivedBuf = Buffer.from(authHeader);
    const isValid =
      expectedBuf.length === receivedBuf.length &&
      timingSafeEqual(expectedBuf, receivedBuf);
    if (!isValid) {
      throw new UnauthorizedException({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid webhook signature',
          details: {},
        },
      });
    }

    if (!body || !body.event) {
      throw new BadRequestException({
        error: {
          code: 'BAD_REQUEST',
          message: 'Missing event payload',
          details: {},
        },
      });
    }

    await this.subscriptionService.processWebhookEvent(body.event);

    return { received: true };
  }

  @Get('subscription/status')
  @UseGuards(FirebaseAuthGuard)
  async getStatus(@CurrentUser() user: { uid: string }) {
    const tier = await this.subscriptionService.getTierForUser(user.uid);
    return { tier };
  }
}
