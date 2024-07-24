import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Role } from 'common/enums/roles_permissions.enum';

@InputType()
export class AuthInput {
  @Field()
  @IsEmail()
  @ApiProperty()
  email: string;

  @Field()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @Field({ nullable: false })
  @ApiProperty()
  role: Role;
}
