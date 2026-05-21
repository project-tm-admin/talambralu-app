import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateInterestDto } from './dto/create-interest.dto';
import { PassProfileDto } from './dto/pass-profile.dto';
import { AddShortlistDto } from './dto/add-shortlist.dto';
import { SubscriptionGuard } from '../subscription/guards/subscription.guard';
import { RequireTier } from '../subscription/decorators/require-tier.decorator';
import { SubscriptionTier } from '@prisma/client';

@Controller('v1')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('matches/pass')
  async passProfile(
    @CurrentUser() user: { uid: string },
    @Body() dto: PassProfileDto,
  ) {
    return this.matchService.passMatch(user.uid, dto.receiverId);
  }

  @Post('shortlist')
  async addToShortlist(
    @CurrentUser() user: { uid: string },
    @Body() dto: AddShortlistDto,
  ) {
    await this.matchService.addToShortlist(user.uid, dto.profileId);
    return { message: 'Profile added to shortlist' };
  }

  @Delete('shortlist/:profileId')
  async removeFromShortlist(
    @CurrentUser() user: { uid: string },
    @Param('profileId', ParseUUIDPipe) profileId: string,
  ) {
    return this.matchService.removeFromShortlist(user.uid, profileId);
  }

  @Get('shortlist')
  async getShortlist(@CurrentUser() user: { uid: string }) {
    return this.matchService.getShortlist(user.uid);
  }

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
