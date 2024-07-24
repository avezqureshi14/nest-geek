import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwilioProvider } from './providers/twilio.provider';
import { SmsController } from './sms.controller';
import { SmsResolver } from './sms.resolver';
import { SmsService } from './sms.service';
@Module({
  imports: [ConfigModule],
  providers: [
    SmsService,
    SmsResolver,
    TwilioProvider,
    {
      provide: 'SmsProvider',
      useClass: TwilioProvider,
    },
  ],
  controllers: [SmsController],
})
export class SmsModule {}
