import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SendSmsResponse } from './dto/send-sms-response.dto'; // Correct import
import { SmsInputDto } from './dto/sms-input.dto';
import { SmsService } from './sms.service';

@Resolver()
export class SmsResolver {
  constructor(private readonly smsService: SmsService) {} // Constructor with dependency injection of SmsService

  // TODO: Add method to send a message
  /**
   * POST endpoint to send SMS to the provided phone number.
   * @param data - The data object.
   * @param smsInputDto - The DTO containing the phone number to send SMS to and message body.
   * @returns An object containing the response message, status code, data, and status.
   */
  // Mutation resolver for sending an SMS
  @Mutation(() => SendSmsResponse)
  async sendSms(@Args('data') data: SmsInputDto): Promise<SendSmsResponse> {
    // method to send an SMS using message body provided in the argument
    return await this.smsService.sendSms(data);
  }

  // Query resolver for getting a health check
  @Query(() => String)
  healthCheck(): string {
    // Method to return a health check message from the SmsService
    return this.smsService.healthCheck();
  }
}
