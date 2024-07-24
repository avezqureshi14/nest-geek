import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class SocialAuthInput {
  @Field()
  @IsEmail()
  @ApiProperty()
  email: string;

  @Field()
  @IsString()
  @ApiProperty()
  name: string;

  @Field()
  @IsString()
  @ApiProperty()
  image_url: string;

  @Field()
  @IsString()
  @ApiProperty()
  token: string;
}
