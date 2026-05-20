import { Injectable } from '@nestjs/common';
import { PrismaReplicaService } from '../../common/prisma/prisma-replica.service';

@Injectable()
export class AdminService {
  constructor(private readonly prismaReplica: PrismaReplicaService) {}

  async getPlatformStats() {
    const [totalUsers, totalMatches, faceVerifiedCount, workVerifiedCount, incomeVerifiedCount] = await Promise.all([
      this.prismaReplica.profile.count(),
      this.prismaReplica.match.count(),
      this.prismaReplica.profile.count({ where: { isFaceVerified: true } }),
      this.prismaReplica.profile.count({ where: { isWorkVerified: true } }),
      this.prismaReplica.profile.count({ where: { isIncomeVerified: true } }),
    ]);

    return {
      totalUsers,
      totalMatches,
      verifications: {
        face: faceVerifiedCount,
        work: workVerifiedCount,
        income: incomeVerifiedCount,
      },
    };
  }
}
