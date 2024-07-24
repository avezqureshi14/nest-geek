import { Inject, Injectable } from '@nestjs/common';
import { SendEmailResponse } from './dto/send-email-response.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailProvider } from './interfaces/email-provider.interface';

@Injectable()
export class EmailService {
  constructor(@Inject('EmailProvider') private readonly emailProvider: EmailProvider) {}

  async sendEmail(data: SendEmailDto): Promise<SendEmailResponse> {
    return await this.emailProvider.sendEmail(data);
  }
}
