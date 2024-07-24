import { EnvConfig } from '@config/env.config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationProvider } from '../interfaces/notification-provider.interface';

@Injectable()
export class FCMProvider implements NotificationProvider {
  private readonly firebaseAdmin: admin.app.App;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    const serviceAccountKeyPath = this.configService.get('FIREBASE_SERVICE_ACCOUNT_KEY_PATH');
    if (!serviceAccountKeyPath) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_PATH environment variable not set');
    }

    const serviceAccountPath = path.resolve(serviceAccountKeyPath);
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    this.firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  async sendNotification(data: NotificationDto): Promise<void> {
    const message = {
      notification: {
        title: data.title,
        body: data.body,
      },
      token: data.token,
    };

    try {
      await this.firebaseAdmin.messaging().send(message);
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new BadRequestException('Could not send notification');
    }
  }
}
