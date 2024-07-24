import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SendEmailResponse {
  @Field(() => Number)
  statusCode: number;

  @Field(() => String)
  status: string;

  @Field(() => String)
  message: string;
}
