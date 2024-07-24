import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerService } from 'common/logger/logger.service';
import { CronDbService } from 'db/cron/cron-db.service';
import { CronExpression } from './enums/cron-expression.enum';

@Injectable()
export class CronService {
  constructor(
    private readonly cronDbService: CronDbService,
    private readonly logger: LoggerService
  ) {}
  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    this.logger.log('Called when the current second is 45');
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async email_not_verified_users() {
    const unverifiedUsers = await this.cronDbService.findUnverifiedUsers();
    this.logger.log(unverifiedUsers);
    //TODO: implement email sending
  }
}
