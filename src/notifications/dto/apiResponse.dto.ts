import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class ApiResponse<T> {
  @Field({ nullable: true })
  statusCode?: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  error?: string;
}
