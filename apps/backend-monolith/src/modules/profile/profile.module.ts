import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { DiscoveryController } from './discovery.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProfileController, DiscoveryController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
