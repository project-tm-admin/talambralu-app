import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [SubscriptionModule],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
