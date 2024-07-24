import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RenewTokenResponseDto {
  @Field()
  accessToken?: string;
}
