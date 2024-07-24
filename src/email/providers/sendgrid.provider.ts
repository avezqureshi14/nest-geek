import { EnvConfig } from '@config/env.config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sendgrid from '@sendgrid/mail';
import { SendEmailResponse } from '../dto/send-email-response.dto';
import { SendEmailDto } from '../dto/send-email.dto';
import { EmailTemplateType } from '../enums/email-template.enum';
import { EmailProvider } from '../interfaces/email-provider.interface';
import { forgotPasswordTemplate } from '../templates/forgotPassword.template';
import { marketingTemplate } from '../templates/marketing.template';
import { otpTemplate } from '../templates/otp.template';
import { signupTemplate } from '../templates/signup.template';
import { standardTemplate } from '../templates/standard.template';

@Injectable()
export class SendgridProvider implements EmailProvider {
  constructor(private readonly configService: ConfigService<EnvConfig>) {
    sendgrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async sendEmail(data: SendEmailDto): Promise<SendEmailResponse> {
    const templateMapping = {
      [EmailTemplateType.OTP]: otpTemplate,
      [EmailTemplateType.STANDARD]: standardTemplate,
      [EmailTemplateType.MARKETING]: marketingTemplate,
      [EmailTemplateType.SIGNUP]: signupTemplate,
      [EmailTemplateType.FORGOT_PASSWORD]: forgotPasswordTemplate,
    };

    try {
      if (data.templateType && templateMapping[data.templateType]) {
        const templateFunction = templateMapping[data.templateType];
        const htmlContent = templateFunction(data);

        const msg = {
          to: data.to,
          from: data.from,
          subject: data.subject,
          text: data.text,
          html: htmlContent,
        };

        const response = await sendgrid.send(msg);
        console.log(response);
        if (response[0].statusCode === 202) {
          return {
            statusCode: 202,
            status: 'Success',
            message: 'Email sent successfully',
          };
        }
      }
    } catch (e) {
      if (e.message === 'Forbidden') {
        throw new ForbiddenException(
          'The from address does not match a verified Sender Identity. Mail cannot be sent until this error is resolved. Visit https://sendgrid.com/docs/for-developers/sending-email/sender-identity/ to see the Sender Identity requirements'
        );
      }
      if (e.message === 'Unauthorized') {
        throw new ForbiddenException('The provided authorization grant is invalid, expired, or revoked');
      }

      throw new Error(`Error sending email: ${e.message}`);
    }
  }
}
