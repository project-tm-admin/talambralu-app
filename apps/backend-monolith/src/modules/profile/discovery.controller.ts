import { Controller, Get, Query } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DiscoveryQueryDto } from '../profile/dto/discovery-query.dto';

@Controller('v1/discovery')
export class DiscoveryController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getDiscovery(
    @CurrentUser() user: { uid: string },
    @Query() query: DiscoveryQueryDto,
  ) {
    return this.profileService.findDiscoveryProfiles(user.uid, query);
  }
}
