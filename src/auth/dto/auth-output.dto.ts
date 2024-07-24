import { Field, ObjectType } from '@nestjs/graphql';
import { UserClient } from './user-type.dto';

@ObjectType()
export class AuthResponseDto {
  @Field()
  accessToken?: string;

  @Field()
  renewAccessToken?: string;

  @Field()
  user?: UserClient;
}
