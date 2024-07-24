import { Inject, Injectable } from '@nestjs/common';
import { NotificationDto } from './dto/notification.dto';
import { RegisterDeviceDto } from './dto/registerDevice.dto';
import { NotificationProvider } from './interfaces/notification-provider.interface';

@Injectable()
export class NotificationService {
  constructor(@Inject('NotificationProvider') private readonly notificationProvider: NotificationProvider) {}

  async sendNotification(notificationDto: NotificationDto): Promise<void> {
    await this.notificationProvider.sendNotification(notificationDto);
  }
  async registerDevice(data: RegisterDeviceDto): Promise<string> {
    return await this.notificationProvider.registerDevice(data);
  }
}
