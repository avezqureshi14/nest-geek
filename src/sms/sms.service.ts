import { Inject, Injectable } from '@nestjs/common';
import { SendSmsResponse } from './dto/send-sms-response.dto';
import { SmsInputDto } from './dto/sms-input.dto';
import { SmsProvider } from './interfaces/sms-provider.interface';

@Injectable()
export class SmsService {
  constructor(@Inject('SmsProvider') private readonly smsProvider: SmsProvider) {} // Constructor with dependency injection of SmsProvider

  // Method to send an SMS
  async sendSms(data: SmsInputDto): Promise<SendSmsResponse> {
    // Asynchronous method to send an SMS using data provided in the argument
    return await this.smsProvider.sendSms(data);
  }

  // Method to get a health check
  healthCheck(): string {
    return 'SMS service is running!';
  }
}
