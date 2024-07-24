import { SendSmsResponse } from '../dto/send-sms-response.dto'; // Import the response DTO
import { SmsInputDto } from '../dto/sms-input.dto'; // Import the input DTO

// Interface for SMS providers
export interface SmsProvider {
  // Method to send an SMS. Takes SMS input data and returns a promise of SMS response.
  sendSms(data: SmsInputDto): Promise<SendSmsResponse>;
}
