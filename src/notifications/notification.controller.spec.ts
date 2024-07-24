// notifications/notifications.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { NotificationDto } from './dto/notification.dto';
import { NotificationProvider } from './interfaces/notification-provider.interface';
import { NotificationService } from './notification.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsModule } from './notifications.module';

class NotificationProviderMock implements NotificationProvider {
  async sendNotification(data: NotificationDto): Promise<void> {
    // Mock implementation
  }
}

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let notificationService: NotificationService;
  const FIREBASE_SERVICE_ACCOUNT_KEY_PATH = '../../../backend-a5a40-firebase-adminsdk-vbdnp-0c8db6de00.json';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NotificationsModule],
      providers: [
        {
          provide: 'NotificationProvider',
          useClass: NotificationProviderMock,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send a notification', async () => {
    const notificationDto: NotificationDto = {
      title: 'Test',
      body: 'This is a test notification',
      token: 'test-token',
    };

    const sendNotificationSpy = jest.spyOn(notificationService, 'sendNotification').mockResolvedValueOnce();

    await controller.sendNotification(notificationDto);

    expect(sendNotificationSpy).toHaveBeenCalledWith(notificationDto);
  });
});
