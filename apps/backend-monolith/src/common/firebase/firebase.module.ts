import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'FIREBASE_APP',
      useFactory: (configService: ConfigService) => {
        const projectId = configService.get<string>('FIREBASE_PROJECT_ID') || 'demo-project';
        const clientEmail = configService.get<string>('FIREBASE_CLIENT_EMAIL');
        const privateKey = configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');

        const credential = clientEmail && privateKey
          ? admin.credential.cert({ projectId, clientEmail, privateKey })
          : admin.credential.applicationDefault(); // Fallback for local/ADC

        // Prevent multiple initializations in dev
        if (!admin.apps.length) {
          return admin.initializeApp({
            credential,
            projectId,
          });
        }
        return admin.app();
      },
      inject: [ConfigService],
    },
  ],
  exports: ['FIREBASE_APP'],
})
export class FirebaseModule {}