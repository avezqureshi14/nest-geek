import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EmailTemplateType } from '../enums/email-template.enum';

@InputType()
export class SendEmailDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  to: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  from: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  subject: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  text: string;

  @Field(() => EmailTemplateType)
  @IsNotEmpty()
  @IsEnum(EmailTemplateType)
  @ApiProperty({
    enum: EmailTemplateType,
    example: Object.keys(EmailTemplateType),
  })
  templateType: EmailTemplateType;
}
