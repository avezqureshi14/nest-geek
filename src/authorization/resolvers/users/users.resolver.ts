import { CreateManyusersArgs } from '@db/@generated/users/create-manyusers.args';
import { CreateOneusersArgs } from '@db/@generated/users/create-oneusers.args';
import { DeleteManyusersArgs } from '@db/@generated/users/delete-manyusers.args';
import { DeleteOneusersArgs } from '@db/@generated/users/delete-oneusers.args';
import { FindManyusersArgs } from '@db/@generated/users/find-manyusers.args';
import { FindUniqueusersArgs } from '@db/@generated/users/find-uniqueusers.args';
import { UpdateManyusersArgs } from '@db/@generated/users/update-manyusers.args';
import { UpdateOneusersArgs } from '@db/@generated/users/update-oneusers.args';
import { usersAggregateArgs } from '@db/@generated/users/users-aggregate.args';
import { DBService } from '@db/db.service';
import { HttpStatus } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthType } from 'common/enums/auth-type.enum';
import { Auth } from '../../../auth/decorator/auth.decorator';
import {
  AggregateUsersResponse,
  CreateManyOutputResponse,
  UniqueUsersResponse,
  UsersResponse,
} from '../../dto/responses.dto';

@Resolver()
export class UsersResolver {
  constructor(private prisma: DBService) {}

  /* 
  
  CRUD operations for users 
  
  */

  @Query(() => UniqueUsersResponse)
  @Auth(AuthType.NONE)
  async users_by_pk(@Args() data: FindUniqueusersArgs): Promise<UniqueUsersResponse> {
    const users = await this.prisma.users.findUnique(data);
    return {
      message: 'Permissions fetched successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: users,
    };
  }

  @Query(() => AggregateUsersResponse)
  @Auth(AuthType.NONE)
  async users_aggregate(@Args() data: usersAggregateArgs): Promise<AggregateUsersResponse> {
    const users = await this.prisma.users.aggregate(data);
    return {
      message: 'Role fetched successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: users,
    };
  }

  @Query(() => UsersResponse)
  @Auth(AuthType.NONE)
  async users(@Args() data: FindManyusersArgs): Promise<UsersResponse> {
    const users = await this.prisma.users.findMany({
      ...data,
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
        user_permissions: true,
      },
    });
    return {
      message: 'users fetched successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: users,
    };
  }

  @Mutation(() => UniqueUsersResponse)
  @Auth(AuthType.NONE)
  async insert_users_one(@Args() data: CreateOneusersArgs): Promise<UniqueUsersResponse> {
    const role = await this.prisma.users.create(data);
    return {
      message: 'users created successfully',
      statusCode: HttpStatus.CREATED,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async insert_users(@Args() data: CreateManyusersArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.users.createMany(data);
    return {
      message: 'users created successfully',
      statusCode: HttpStatus.CREATED,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => UniqueUsersResponse)
  @Auth(AuthType.NONE)
  async update_users(@Args() data: UpdateOneusersArgs): Promise<UniqueUsersResponse> {
    const role = await this.prisma.users.update(data);
    return {
      message: 'users updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => UniqueUsersResponse)
  @Auth(AuthType.NONE)
  async update_users_by_pk(@Args() data: UpdateOneusersArgs): Promise<UniqueUsersResponse> {
    const role = await this.prisma.users.update(data);
    return {
      message: 'users updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async update_many_users(@Args() data: UpdateManyusersArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.users.updateMany(data);
    return {
      message: 'users updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async delete_users(@Args() data: DeleteManyusersArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.users.deleteMany(data);

    return {
      message: 'users deleted successfully',
      statusCode: 200,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => UniqueUsersResponse)
  @Auth(AuthType.NONE)
  async delete_users_by_pk(@Args() data: DeleteOneusersArgs): Promise<UniqueUsersResponse> {
    const role = this.prisma.users.delete(data);
    return {
      message: 'users deleted successfully',
      statusCode: 200,
      status: 'Success',
      data: role,
    };
  }
}
