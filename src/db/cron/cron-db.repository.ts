import { Injectable } from '@nestjs/common';
import { users } from '@prisma/client';
import { DBService } from './../db.service';

@Injectable()
export class CronRepository {
  constructor(private prisma: DBService) {}

  async findNotVerifiedUsers(): Promise<users[]> {
    return await this.prisma.users.findMany({
      where: {
        email_verified: false,
      },
    });
  }
}
