import { CreateManyuserRolesArgs } from '@db/@generated/prisma/create-manyuser-roles.args';
import { DeleteManyuserRolesArgs } from '@db/@generated/prisma/delete-manyuser-roles.args';
import { UpdateManyuserRolesArgs } from '@db/@generated/prisma/update-manyuser-roles.args';
import { DBService } from '@db/db.service';
import { HttpStatus } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthType } from 'common/enums/auth-type.enum';
import { Auth } from '../../../auth/decorator/auth.decorator';
import { CreateManyOutputResponse } from '../../dto/responses.dto';

@Resolver()
export class UsersRolesResolver {
  constructor(private prisma: DBService) {}

  /* 
  
  CRUD operations for users_roles 
  
  */

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async insert_users_roles(@Args() data: CreateManyuserRolesArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.user_roles.createMany(data);
    return {
      message: 'users_roles created successfully',
      statusCode: HttpStatus.CREATED,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async update_many_users_roles(@Args() data: UpdateManyuserRolesArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.user_roles.updateMany(data);
    return {
      message: 'users_roles updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async delete_users_roles(@Args() data: DeleteManyuserRolesArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.user_roles.deleteMany(data);

    return {
      message: 'users_roles deleted successfully',
      statusCode: 200,
      status: 'Success',
      data: role,
    };
  }
}
