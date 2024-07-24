import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './email.service';
import { EmailTemplateType } from './enums/email-template.enum';
import { EmailProvider } from './interfaces/email-provider.interface';
import { ApiResponse } from '../common/dto/api-response';

class EmailProviderMock implements EmailProvider {
  async sendEmail(data: SendEmailDto): Promise<ApiResponse<null>> {
    // Mock implementation
  }
}

describe('EmailService', () => {
  let service: EmailService;
  let emailProvider: EmailProviderMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService, { provide: 'EmailProvider', useClass: EmailProviderMock }],
    }).compile();

    service = module.get<EmailService>(EmailService);
    emailProvider = module.get<EmailProviderMock>('EmailProvider');
  });

  describe('sendEmail', () => {
    it('should call emailProvider.sendEmail with the provided dto', async () => {
      // Arrange
      const dto: SendEmailDto = {
        to: 'test@example.com',
        from: 'sender@example.com',
        subject: 'Test email',
        text: 'This is a test email',
        templateType: EmailTemplateType.STANDARD,
      };
      const sendEmailSpy = jest.spyOn(emailProvider, 'sendEmail');

      // Act
      await service.sendEmail(dto);

      // Assert
      expect(sendEmailSpy).toHaveBeenCalledWith(dto);
    });

    it('should throw an error if emailProvider.sendEmail throws an error', async () => {
      // Arrange
      const dto: SendEmailDto = {
        to: 'test@example.com',
        from: 'sender@example.com',
        subject: 'Test email',
        text: 'This is a test email',
        templateType: EmailTemplateType.STANDARD,
      };
      const errorMessage = 'Email sending failed';
      jest.spyOn(emailProvider, 'sendEmail').mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(service.sendEmail(dto)).rejects.toThrowError(errorMessage);
    });

    it('should not throw an error when emailProvider.sendEmail resolves successfully', async () => {
      // Arrange
      const dto: SendEmailDto = {
        to: 'test@example.com',
        from: 'sender@example.com',
        subject: 'Test email',
        text: 'This is a test email',
        templateType: EmailTemplateType.STANDARD,
      };
      jest.spyOn(emailProvider, 'sendEmail').mockResolvedValueOnce();

      // Act & Assert
      await expect(service.sendEmail(dto)).resolves.not.toThrow();
    });
  });
});
