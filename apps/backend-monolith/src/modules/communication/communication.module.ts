import { Module } from '@nestjs/common';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';
import { CommunicationGateway } from './communication.gateway';
import { MatchModule } from '../match/match.module';

@Module({
  imports: [MatchModule],
  controllers: [CommunicationController],
  providers: [CommunicationService, CommunicationGateway],
})
export class CommunicationModule {}
