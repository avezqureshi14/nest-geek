import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailResolver } from './email.resolver';
import { EmailService } from './email.service';
import { SendgridProvider } from './providers/sendgrid.provider';

@Module({
  controllers: [EmailController],
  providers: [
    EmailService,
    {
      provide: 'EmailProvider',
      useClass: SendgridProvider,
    },
    EmailResolver,
  ],
  exports: [EmailService],
})
export class EmailModule {}
