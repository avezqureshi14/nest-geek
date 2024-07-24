// notifications/notification.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { NotificationDto } from './dto/notification.dto';
import { NotificationProvider } from './interfaces/notification-provider.interface';
import { NotificationService } from './notification.service';
import { FCMProvider } from './providers/fcm.provider';

class NotificationProviderMock implements NotificationProvider {
  async sendNotification(data: NotificationDto): Promise<void> {
    // Mock implementation
  }
}

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationProvider: NotificationProviderMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: 'NotificationProvider',
          useClass: NotificationProviderMock,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notificationProvider = module.get<NotificationProviderMock>('NotificationProvider');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a notification', async () => {
    const notificationDto: NotificationDto = {
      title: 'Test',
      body: 'This is a test notification',
      token: 'test-token',
    };

    const sendNotificationSpy = jest.spyOn(notificationProvider, 'sendNotification').mockResolvedValueOnce();

    await service.sendNotification(notificationDto);

    expect(sendNotificationSpy).toHaveBeenCalledWith(notificationDto);
  });
});
