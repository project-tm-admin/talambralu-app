import { Module } from '@nestjs/common';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';
import { CommunicationGateway } from './communication.gateway';
import { MatchModule } from '../match/match.module';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [MatchModule, PrismaModule],
  controllers: [CommunicationController],
  providers: [CommunicationService, CommunicationGateway],
})
export class CommunicationModule {}
