import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { DiscoveryController } from './discovery.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController, DiscoveryController],
  providers: [ProfileService],
})
export class ProfileModule {}
