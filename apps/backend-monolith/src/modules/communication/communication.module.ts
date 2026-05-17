import { Module } from '@nestjs/common';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';
import { CommunicationGateway } from './communication.gateway';

@Module({
  controllers: [CommunicationController],
  providers: [CommunicationService, CommunicationGateway],
})
export class CommunicationModule {}
