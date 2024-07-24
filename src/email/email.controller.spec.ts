import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailResponse } from './dto/send-email-response.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailController } from './email.controller';
import { EmailModule } from './email.module';
import { EmailService } from './email.service';
import { EmailTemplateType } from './enums/email-template.enum';

class EmailProviderMock {
  async sendEmail(data: SendEmailDto): Promise<SendEmailResponse> {
    // Mock implementation
  }
}

describe('EmailController', () => {
  let controller: EmailController;
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EmailModule],
      providers: [
        {
          provide: 'EmailProvider',
          useClass: EmailProviderMock,
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    service = module.get<EmailService>(EmailService);
  });

  describe('sendEmail', () => {
    it('should call emailService.sendEmail with the provided dto', async () => {
      // Arrange
      const dto: SendEmailDto = {
        to: 'test@example.com',
        from: 'sender@example.com',
        subject: 'Test email',
        text: 'This is a test email',
        templateType: EmailTemplateType.STANDARD,
      };
      const sendEmailSpy = jest.spyOn(service, 'sendEmail').mockResolvedValueOnce();

      // Act
      await controller.sendEmail(dto);

      // Assert
      expect(sendEmailSpy).toHaveBeenCalledWith(dto);
    });
  });
});
