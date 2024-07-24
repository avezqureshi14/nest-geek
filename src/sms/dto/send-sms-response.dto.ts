import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQlApiResponse } from 'common/dto/graphql-response';

@ObjectType()
export class SendSmsResponseDto {
  @Field(() => String)
  sid?: string;

  @Field(() => String)
  status?: string;
}
@ObjectType()
export class SendSmsResponse extends GraphQlApiResponse(SendSmsResponseDto) {}
