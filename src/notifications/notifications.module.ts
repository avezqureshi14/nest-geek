// notifications/notifications.module.ts

import { Module } from '@nestjs/common';
import { NotificationsResolver } from './auth.resolver';
import { NotificationService } from './notification.service';
import { NotificationsController } from './notifications.controller';
import { FCMProvider } from './providers/fcm.provider';
import { SNSProvider } from './providers/sns.provider';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationService,
    {
      provide: 'NotificationProvider',
      useClass: FCMProvider,
      // useClass: SNSProvider,
    },
    NotificationsResolver,
  ],
})
export class NotificationsModule {}
