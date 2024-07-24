import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

@InputType()
export class EmailOnlyInputDto {
  @ApiProperty({
    description: 'The email address for password reset',
    example: 'example@email.com',
  })
  @Field()
  @IsEmail()
  email: string;
}
