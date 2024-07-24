import { AuthModule } from '@auth/auth.module';
import { AuthorizationModule } from '@authorization/authorization.module';
import { EnvConfigModule } from '@config/env-config.module';
import { DBModule } from '@db/db.module';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { TransformInterceptor } from 'common/interceptor/transform.interceptor';
import { CronModule } from './cron-module/cron.module';
import { EmailModule } from './email/email.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PubSubModule } from './pub-sub/pub-sub.module';
import { SmsModule } from './sms/sms.module';
import { RateLimitGuard } from './socket/guards/rate-limit.guard';
import { WsAuthGuard } from './socket/guards/ws-auth.guard';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': {
          path: '/graphql',
        },
      },
      context: ({ req }) => ({
        req,
      }),
    }),
    AuthModule,
    EnvConfigModule,
    DBModule,
    AuthorizationModule,
    NotificationsModule,
    SmsModule,
    CronModule,
    PubSubModule,
    EmailModule,
    SocketModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [
    // WsAuthGuard,
    // RateLimitGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule { }
