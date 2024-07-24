import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerService } from 'common/logger/logger.service';
import { CronService } from './cron.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronService, LoggerService],
})
export class CronModule {}
