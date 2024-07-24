import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

// Create a DTO class for the completePasswordReset endpoint
@InputType()
export class completePasswordResetDto {
  @ApiProperty({
    description: 'The new password for users',
    example: 'Password@123',
  })
  @Field()
  newPassword: string;
}
