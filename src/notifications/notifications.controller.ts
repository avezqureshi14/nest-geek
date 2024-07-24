// notifications/notifications.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'common/dto/api-response';
import { NotificationDto } from './dto/notification.dto';
import { RegisterDeviceDto } from './dto/registerDevice.dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
@ApiTags('Notification-Controller')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  async sendNotification(@Body() notification: NotificationDto): Promise<ApiResponse<null>> {
    await this.notificationService.sendNotification(notification);
    return {
      statusCode: 201,
      status: 'Success',
      message: 'Notification sent successfully',
      data: null,
    };
  }

  @Post('registerMobileDevice')
  async createMobileArn(@Body() data: RegisterDeviceDto): Promise<ApiResponse<{ endpointArn: string }>> {
    const endpointArn = await this.notificationService.registerDevice(data);
    return {
      statusCode: 201,
      status: 'Success',
      message: 'Device registered successfully',
      data: {
        endpointArn,
      },
    };
  }
}
