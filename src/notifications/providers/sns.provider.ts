import { CreatePlatformEndpointCommand, PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { EnvConfig } from '@config/env.config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationDto } from '../dto/notification.dto';
import { RegisterDeviceDto } from '../dto/registerDevice.dto';
import { NotificationProvider } from '../interfaces/notification-provider.interface';

@Injectable()
export class SNSProvider implements NotificationProvider {
  private readonly sns: SNSClient;
  private readonly platformApplicationArn: string;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    // Retrieve AWS credentials and platform application ARN from environment
    const awsAccessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
    const awsRegion = this.configService.get('AWS_REGION');
    this.platformApplicationArn = this.configService.get('PLATFORM_APPLICATION_ARN');

    // Validate that all required configuration values are provided
    if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey || !this.platformApplicationArn) {
      throw new Error('AWS Region, Access Key ID, Secret Access Key, or Platform Application ARN not set');
    }

    // Initialize AWS SNS client
    this.sns = new SNSClient({ region: awsRegion });
    this.sns.config.credentials({
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    });
  }

  /**
   * Register a mobile device with AWS SNS.
   * @param data RegisterDeviceDto object containing the device token.
   * @returns The ARN (Amazon Resource Name) of the registered device endpoint.
   */
  async registerDevice(data: RegisterDeviceDto): Promise<string> {
    const params = {
      PlatformApplicationArn: this.platformApplicationArn,
      Token: data.token,
    };

    try {
      const command = new CreatePlatformEndpointCommand(params);
      const response = await this.sns.send(command);
      return response.EndpointArn!;
    } catch (error) {
      console.error('Error registering device:', error);
      throw error;
    }
  }

  /**
   * Send a push notification to a registered device.
   * @param data NotificationDto object containing notification details.
   */
  async sendNotification(data: NotificationDto): Promise<void> {
    if (!data.endpointArn) {
      // Validate that the endpoint ARN is provided
      throw new BadRequestException('Endpoint Arn not passed');
    }

    // Construct parameters for the publish action
    const params = {
      Message: JSON.stringify({
        default: data.body,
        APNS: {
          aps: {
            alert: {
              title: data.title,
              body: data.body,
            },
          },
        },
        GCM: {
          data: {
            title: data.title,
            body: data.body,
          },
        },
      }),
      MessageStructure: 'json',
      TargetArn: data.endpointArn,
    };

    try {
      const command = new PublishCommand(params);
      await this.sns.send(command);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new BadRequestException('Could not send notification');
    }
  }
}
