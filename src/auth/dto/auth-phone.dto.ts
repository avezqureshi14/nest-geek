import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'common/enums/roles_permissions.enum';

@InputType()
export class authPhoneDto {
  @Field()
  @ApiProperty()
  phone_number: string;

  @Field({ nullable: true })
  @ApiProperty()
  role: Role;
}
