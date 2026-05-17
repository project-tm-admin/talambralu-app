import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { MatchService } from '../match/match.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('v1')
@UseGuards(FirebaseAuthGuard)
export class CommunicationController {
  constructor(
    private communicationService: CommunicationService,
    private matchService: MatchService,
  ) {}

  @Get('communication/messages/:matchId')
  async getMessages(
    @Param('matchId', ParseUUIDPipe) matchId: string,
    @CurrentUser() user: { uid: string },
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    const userId = user.uid;

    const isParticipant = await this.matchService.isUserInMatch(userId, matchId);
    if (!isParticipant) {
      throw new ForbiddenException('Unauthorized access to match room');
    }

    if (before && isNaN(new Date(before).getTime())) {
      throw new BadRequestException('Invalid date format for "before" parameter');
    }

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);

    return this.communicationService.getMessages(
      matchId,
      parsedLimit,
      before,
    );
  }
}
