import { SendEmailResponse } from '../dto/send-email-response.dto';
import { SendEmailDto } from '../dto/send-email.dto';

export interface EmailProvider {
  sendEmail(data: SendEmailDto): Promise<SendEmailResponse>;
}
