import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class validateOtpDto {
  @ApiProperty({
    description: 'The phone number for verification',
    example: '1234567890', // Provide an example value
  })
  @Field()
  phone_no: string;

  @ApiProperty({
    description: 'The OTP (One-Time Password) for verification',
    example: '123456', // Provide an example value
  })
  @Field()
  otp: string;
}
