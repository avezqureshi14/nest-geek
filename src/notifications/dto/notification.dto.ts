import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class NotificationDto {
  @Field()
  @IsString()
  @ApiProperty()
  readonly title: string;

  @Field()
  @IsString()
  @ApiProperty()
  readonly body: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  readonly token?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  readonly endpointArn?: string;
}
