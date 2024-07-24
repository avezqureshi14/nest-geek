import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { SendSmsResponse } from './dto/send-sms-response.dto';
import { SmsInputDto } from './dto/sms-input.dto';
import { SmsService } from './sms.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('SMS-Controller')
export class SmsController {
  constructor(private readonly appService: SmsService) {}

  // TODO: Add method to send a message
  /**
   * POST endpoint to send SMS to the provided phone number.
   * @param req - The request object.
   * @param smsInputDto - The DTO containing the phone number to send SMS to and message body.
   * @returns An object containing the response message, status code, data, and status.
   */
  @Post('sendSms')
  async sendSms(@Request() req, @Body() smsInputDto: SmsInputDto): Promise<SendSmsResponse> {
    // Call the appService to send SMS to the provided phone number
    const response = await this.appService.sendSms(smsInputDto);

    // Return response object indicating success
    return response;
  }

  /**
   * GET endpoint to check the health of the SMS service.
   * @returns A string indicating the health status of the SMS service.
   */
  @Get('healthCheck')
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
