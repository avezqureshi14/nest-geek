import { CreateManyuserPermissionsArgs } from '@db/@generated/prisma/create-manyuser-permissions.args';
import { DeleteManyuserPermissionsArgs } from '@db/@generated/prisma/delete-manyuser-permissions.args';
import { UpdateManyuserPermissionsArgs } from '@db/@generated/prisma/update-manyuser-permissions.args';
import { DBService } from '@db/db.service';
import { HttpStatus } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthType } from 'common/enums/auth-type.enum';
import { Auth } from '../../../auth/decorator/auth.decorator';
import { CreateManyOutputResponse } from '../../dto/responses.dto';

@Resolver()
export class UsersPermissionsResolver {
  constructor(private prisma: DBService) {}

  /* 
  
  CRUD operations for users_permissions
  
  */

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async insert_users_permissions(@Args() data: CreateManyuserPermissionsArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.user_permissions.createMany(data);
    return {
      message: 'user_permissions created successfully',
      statusCode: HttpStatus.CREATED,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async update_many_users_permissions(@Args() data: UpdateManyuserPermissionsArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.user_roles.updateMany(data);
    return {
      message: 'users_permissions updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async delete_users_permissions(@Args() data: DeleteManyuserPermissionsArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.user_permissions.deleteMany(data);

    return {
      message: 'user_permissions deleted successfully',
      statusCode: 200,
      status: 'Success',
      data: role,
    };
  }
}
