import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request['user'];

    if (!user || !user.uid) {
      throw new UnauthorizedException({
        error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    const profile = await this.prisma.profile.findUnique({
      where: { userId: user.uid },
      select: { isAdmin: true },
    });

    if (!profile || !profile.isAdmin) {
      throw new ForbiddenException({
        error: { code: 'FORBIDDEN', message: 'User does not have admin privileges' },
      });
    }

    return true;
  }
}
