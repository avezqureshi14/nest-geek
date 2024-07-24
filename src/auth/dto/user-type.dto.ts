import { Field, ID, ObjectType, OmitType } from '@nestjs/graphql';
import { $Enums, users as DbUser } from '@prisma/client';

@ObjectType()
export class UserType implements DbUser {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  gender: $Enums.gender;

  @Field({ nullable: true })
  first_name: string;

  @Field({ nullable: true })
  last_name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  last_login: Date;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  created_at: Date;

  @Field({ nullable: true })
  updated_at: Date;

  @Field({ nullable: true })
  email_verified: boolean;

  @Field({ nullable: true })
  phone_number: string;

  @Field({ nullable: true })
  reset_token: string;

  @Field({ nullable: true })
  reset_token_expiry: Date;

  @Field({ nullable: true })
  is_active: boolean;

  @Field({ nullable: true })
  city: string;

  @Field({ nullable: true })
  state: string;

  @Field({ nullable: true })
  country: string;
}

@ObjectType()
export class UserClient extends OmitType(UserType, ['password', 'reset_token', 'reset_token_expiry']) {}
