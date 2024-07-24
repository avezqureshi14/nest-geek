import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQlApiResponse } from 'common/dto/graphql-response';

@ObjectType()
export class AuthPhoneResponseDto {
  @Field()
  accessToken: string;
}
@ObjectType()
export class AuthPhoneResponse extends GraphQlApiResponse(AuthPhoneResponseDto) {}
