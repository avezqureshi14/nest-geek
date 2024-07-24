import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthRepository } from './auth/auth-db.repository';
import { AuthDbService } from './auth/auth-db.service';
import { CronRepository } from './cron/cron-db.repository';
import { CronDbService } from './cron/cron-db.service';
import { DBService } from './db.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DBService, AuthDbService, AuthRepository, CronDbService, CronRepository],
  exports: [AuthDbService, DBService, CronDbService],
})
export class DBModule {}
