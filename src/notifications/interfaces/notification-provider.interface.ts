import { NotificationDto } from '../dto/notification.dto';
import { RegisterDeviceDto } from '../dto/registerDevice.dto';

export interface NotificationProvider {
  sendNotification(data: NotificationDto): Promise<void>;
  registerDevice?(data: RegisterDeviceDto): Promise<string>;
}
