import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './email.service';

@Controller('email')
@ApiTags('Email-Controller')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() dto: SendEmailDto) {
    return this.emailService.sendEmail(dto);
  }
}
