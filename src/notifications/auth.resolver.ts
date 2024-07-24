import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApiResponse } from './dto/apiResponse.dto';
import { NotificationDto } from './dto/notification.dto';
import { RegisterDeviceDto } from './dto/registerDevice.dto';
import { RegisterResponse } from './dto/registerResponse.dto';
import { NotificationService } from './notification.service';

@Resolver('Notification')
export class NotificationsResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => ApiResponse)
  async sendNotification(@Args('notification') notification: NotificationDto) {
    await this.notificationService.sendNotification(notification);
    return {
      statusCode: 201,
      status: 'Success',
      message: 'Notification sent successfully',
    };
  }
  @Mutation(() => RegisterResponse)
  async registerMobileDevice(@Args('data') data: RegisterDeviceDto) {
    const endpointArn = await this.notificationService.registerDevice(data);
    return {
      statusCode: 201,
      status: 'Success',
      message: 'Device registered successfully',
      endpointArn,
    };
  }

  @Query(() => String)
  healthCheck(): string {
    return 'Notification server is running';
  }
}
