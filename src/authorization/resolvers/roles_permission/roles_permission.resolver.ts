import { CreateManyrolePermissionsArgs } from '@db/@generated/prisma/create-manyrole-permissions.args';
import { DeleteManyrolePermissionsArgs } from '@db/@generated/prisma/delete-manyrole-permissions.args';
import { UpdateManyrolePermissionsArgs } from '@db/@generated/prisma/update-manyrole-permissions.args';
import { DBService } from '@db/db.service';
import { HttpStatus } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthType } from 'common/enums/auth-type.enum';
import { Auth } from '../../../auth/decorator/auth.decorator';
import { CreateManyOutputResponse } from '../../dto/responses.dto';

@Resolver()
export class RolesPermissionsResolver {
  constructor(private prisma: DBService) {}

  /* 
  
  CRUD operations for users_permissions
  
  */

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async insert_roles_permissions(@Args() data: CreateManyrolePermissionsArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.role_permissions.createMany(data);
    return {
      message: 'user_permissions created successfully',
      statusCode: HttpStatus.CREATED,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async update_many_roles_permissions(@Args() data: UpdateManyrolePermissionsArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.role_permissions.updateMany(data);
    return {
      message: 'users_permissions updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async delete_roles_permissions(@Args() data: DeleteManyrolePermissionsArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.role_permissions.deleteMany(data);

    return {
      message: 'user_permissions deleted successfully',
      statusCode: 200,
      status: 'Success',
      data: role,
    };
  }
}
