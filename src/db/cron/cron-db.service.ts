import { Injectable } from '@nestjs/common';
import { users } from '@prisma/client';
import { CronRepository } from './cron-db.repository';

@Injectable()
export class CronDbService {
  constructor(private cronRepository: CronRepository) {}

  async findUnverifiedUsers(): Promise<users[]> {
    return await this.cronRepository.findNotVerifiedUsers();
  }
}
