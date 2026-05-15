import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('v1/auth')
export class AuthController {
  @Get('me')
  getMe(@CurrentUser() user: any) {
    return {
      success: true,
      message: 'Token is valid',
      user: {
        uid: user?.uid || 'mock-uid-from-test',
        email: user?.email,
      }
    };
  }
}
