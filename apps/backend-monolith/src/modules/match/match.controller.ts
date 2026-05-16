import { Controller, Post, Get, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { MatchService } from './match.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateInterestDto } from './dto/create-interest.dto';

@Controller('v1')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('interests')
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
  async acceptInterest(
    @CurrentUser() user: { uid: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.matchService.acceptInterest(user.uid, id);
  }

  @Post('interests/:id/decline')
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
