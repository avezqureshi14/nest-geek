import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';

@Injectable()
export class DBService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pgClient: Client;
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
    this.pgClient = new Client({
      connectionString: config.get('DATABASE_URL'),
    });
  }

  async onModuleInit() {
    console.log('Here');
    await this.$connect();
    await this.pgClient.connect();

    this.pgClient.on('notification', async (msg) => {
      console.log('Received notification: ', msg);
      if (msg.channel === 'password_updates') {
        console.log('Received password update notification', msg);
        // Handle NOTIFY events
        // const payload = JSON.parse(msg.payload)
        // TODO: Process the notification (e.g., publish to a pub/sub system)
      }
    });

    await this.pgClient.query('LISTEN password_updates');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pgClient.end();
  }
}
