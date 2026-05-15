import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

@Controller('v1/profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async upsert(
    @CurrentUser() user: { uid: string },
    @Body() dto: UpsertProfileDto,
  ) {
    return this.profileService.upsertProfile(user.uid, dto);
  }

  @Get('me')
  async getMe(@CurrentUser() user: { uid: string }) {
    return this.profileService.getProfileByUserId(user.uid);
  }
}
