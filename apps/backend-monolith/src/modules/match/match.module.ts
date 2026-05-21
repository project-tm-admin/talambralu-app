import { Module, forwardRef } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [SubscriptionModule, forwardRef(() => ProfileModule)],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
