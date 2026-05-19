import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateInterestDto } from './dto/create-interest.dto';
import { SubscriptionGuard } from '../subscription/guards/subscription.guard';
import { RequireTier } from '../subscription/decorators/require-tier.decorator';
import { SubscriptionTier } from '@prisma/client';

@Controller('v1')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('interests')
  @UseGuards(SubscriptionGuard)
  @RequireTier(SubscriptionTier.PREMIUM)
  async createInterest(
    @CurrentUser() user: { uid: string },
    @Body() dto: CreateInterestDto,
  ) {
    return this.matchService.createInterest(user.uid, dto.receiverId);
  }

  @Get('interests/pending')
  async getPendingInterests(@CurrentUser() user: { uid: string }) {
    return this.matchService.getPendingInterests(user.uid);
  }

  @Post('interests/:id/accept')
  @UseGuards(SubscriptionGuard)
  @RequireTier(SubscriptionTier.PREMIUM)
  async acceptInterest(
    @CurrentUser() user: { uid: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.matchService.acceptInterest(user.uid, id);
  }

  @Post('interests/:id/decline')
  @UseGuards(SubscriptionGuard)
  @RequireTier(SubscriptionTier.PREMIUM)
  async declineInterest(
    @CurrentUser() user: { uid: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.matchService.declineInterest(user.uid, id);
  }

  @Get('matches')
  async getMatches(@CurrentUser() user: { uid: string }) {
    return this.matchService.getMatches(user.uid);
  }
}
