import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from './env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () =>
          ({
            FIREBASE_SERVICE_ACCOUNT_KEY_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH,
            DATABASE_URL: process.env.DATABASE_URL,
            JWT_SECRET: process.env.JWT_SECRET,
            REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
            FRONTEND_URL: process.env.FRONTEND_URL,
            PORT: parseInt(process.env.PORT, 10),
            NODE_ENV: process.env.NODE_ENV,
            SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
            TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
            TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
            TWILIO_SOURCE_NUMBER: process.env.TWILIO_SOURCE_NUMBER,
          }) as EnvConfig,
      ],
      validate: (config: EnvConfig) => {
        const errorMessages = [];

        // Validate DATABASE_URL
        if (!config.DATABASE_URL) {
          errorMessages.push('DATABASE_URL should not be empty');
        }

        // Validate JWT_SECRET
        if (!config.JWT_SECRET) {
          errorMessages.push('JWT_SECRET should not be empty');
        }

        // Validate REFRESH JWT SECRET
        if (!config.REFRESH_JWT_SECRET) {
          errorMessages.push('REFRESH_JWT_SECRET should not be empty');
        }

        // Validate FRONTEND URL
        if (!config.FRONTEND_URL) {
          errorMessages.push('FRONTEND_URL should not be empty');
        }

        // Validate TWILIO ACCOUNT SID
        if (!config.TWILIO_ACCOUNT_SID) {
          errorMessages.push('TWILIO_ACCOUNT_SID should not be empty');
        }

        // Validate TWILIO AUTH TOKEN
        if (!config.TWILIO_AUTH_TOKEN) {
          errorMessages.push('TWILIO_AUTH_TOKEN should not be empty');
        }

        // Validate TWILIO SOURCE NUMBER
        if (!config.TWILIO_SOURCE_NUMBER) {
          errorMessages.push('TWILIO_SOURCE_NUMBER should not be empty');
        }

        // Validate SENDGRID_API_KEY
        if (!config.SENDGRID_API_KEY) {
          errorMessages.push('SENDGRID_API_KEY should not be empty');
        }

        // Validate FIREBASE_SERVICE_ACCOUNT_KEY_PATH
        if (!config.FIREBASE_SERVICE_ACCOUNT_KEY_PATH) {
          errorMessages.push('FIREBASE_SERVICE_ACCOUNT_KEY_PATH should not be empty');
        }

        // Validate PORT
        if (isNaN(config.PORT)) {
          errorMessages.push('PORT should be a valid number');
        }
        if (config.PORT === undefined || config.PORT < 0 || config.PORT > 65535) {
          errorMessages.push('PORT should be between 0 and 65535');
        }

        // Common validation
        if (errorMessages.length > 0) {
          throw new Error(`Environment validation failed:\n${errorMessages.join('\n')}`);
        }

        return config;
      },
    }),
  ],
  exports: [ConfigModule],
})
export class EnvConfigModule {}
