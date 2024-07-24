import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EnvConfig {
  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  REFRESH_JWT_SECRET: string;

  @IsNotEmpty()
  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  @IsNumber()
  FRONTEND_URL: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_CALLBACK_URL: string;

  @IsNotEmpty()
  @IsString()
  FACEBOOK_CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  FACEBOOK_CLIENT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  FACEBOOK_CALLBACK_URL: string;

  @IsNotEmpty()
  @IsString()
  LINKEDIN_CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  LINKEDIN_CLIENT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  LINKEDIN_CALLBACK_URL: string;

  @IsNotEmpty()
  @IsString()
  FACEBOOK_URL: string;

  @IsNotEmpty()
  @IsString()
  LINKEDIN_URL: string;

  @IsNotEmpty()
  @IsString()
  NODE_ENV: string;

  @IsNotEmpty()
  @IsString()
  TWILIO_ACCOUNT_SID: string;

  @IsNotEmpty()
  @IsString()
  TWILIO_AUTH_TOKEN: string;

  @IsNotEmpty()
  @IsString()
  TWILIO_SOURCE_NUMBER: string;

  @IsNotEmpty()
  @IsString()
  SENDGRID_API_KEY: string;

  @IsNotEmpty()
  @IsString()
  FIREBASE_SERVICE_ACCOUNT_KEY_PATH: string;

  @IsNotEmpty()
  @IsString()
  AWS_ACCESS_KEY_ID: string;

  @IsNotEmpty()
  @IsString()
  AWS_SECRET_ACCESS_KEY: string;

  @IsNotEmpty()
  @IsString()
  AWS_REGION: string;

  @IsNotEmpty()
  @IsString()
  PLATFORM_APPLICATION_ARN: string;
}
