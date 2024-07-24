import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class RegisterDeviceDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly token: string;
}
