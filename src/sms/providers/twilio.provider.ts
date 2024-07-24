import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio'; // Import Twilio module
import { SendSmsResponse } from '../dto/send-sms-response.dto'; // Import the response
import { SmsInputDto } from '../dto/sms-input.dto'; // Import the input DTO
import { SmsProvider } from '../interfaces/sms-provider.interface'; // Import the SmsProvider interface

@Injectable()
export class TwilioProvider implements SmsProvider {
  private readonly client: Twilio; // Twilio client instance
  private readonly source_number: string; // Twilio source number

  constructor(private readonly configService: ConfigService) {
    // Retrieve Twilio credentials and source number from environment variables
    const accountSid: string = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken: string = this.configService.get('TWILIO_AUTH_TOKEN');
    this.source_number = this.configService.get('TWILIO_SOURCE_NUMBER');

    // Initialize Twilio client with credentials
    this.client = new Twilio(accountSid, authToken);
  }

  // Method to send an SMS using Twilio
  async sendSms(data: SmsInputDto): Promise<SendSmsResponse> {
    try {
      // Send SMS using Twilio client
      const message = await this.client.messages.create({
        body: data.body,
        to: data.number,
        from: this.source_number,
      });
      console.log('SMS sent successfully:', message.sid);

      // Return success response
      return {
        status: 'Success',
        statusCode: 201,
        message: 'SMS sent successfully',
        data: message,
      };
    } catch (error) {
      // TODO: Add proper error handling here
      // Log and re-throw any errors that occur during SMS sending
      console.error('Failed to send SMS:', error);
      throw new InternalServerErrorException('Failed to send SMS'); // Rethrow error to propagate it to the caller
    }
  }
}
