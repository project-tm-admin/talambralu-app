import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { VerificationModule } from './modules/verification/verification.module';
import { MatchModule } from './modules/match/match.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { UploadModule } from './modules/upload/upload.module';
import { FirebaseModule } from './common/firebase/firebase.module';
import { FirebaseAuthGuard } from './common/guards/firebase-auth.guard';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    PrismaModule,
    AuthModule,
    ProfileModule,
    UploadModule,
    VerificationModule,
    MatchModule,
    CommunicationModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
  ],
})
export class AppModule {}
