import { registerEnumType } from '@nestjs/graphql';

export enum EmailTemplateType {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  OTP = 'OTP',
  SIGNUP = 'SIGNUP',
  STANDARD = 'STANDARD',
  MARKETING = 'MARKETING',
}

// Register the EmailTemplateType enum with GraphQL
registerEnumType(EmailTemplateType, {
  name: 'EmailTemplateType',
});
