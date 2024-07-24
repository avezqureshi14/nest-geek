import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@InputType()
export class SmsInputDto {
  @Field()
  @IsString()
  @ApiProperty()
  number: string; // The phone number to which the SMS will be sent

  @Field()
  @IsString()
  @ApiProperty()
  body: string; // The body/content of the SMS
}
