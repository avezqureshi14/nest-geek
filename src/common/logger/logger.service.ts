import { EnvConfig } from '@config/env.config';
import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  private isLoggingEnabled: boolean;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    super();
    this.isLoggingEnabled = this.configService.get('NODE_ENV') !== 'production';
  }

  error(message: any, trace?: string, context?: string) {
    if (this.isLoggingEnabled) {
      super.error(message, trace, context);
    }
  }

  log(message: any, context?: string) {
    // add your tailored log here
    if (this.isLoggingEnabled) {
      super.log(message, context);
    }
  }

  warn(message: any, context?: string) {
    // add your tailored log here
    if (this.isLoggingEnabled) {
      super.warn(message, context);
    }
  }
}
