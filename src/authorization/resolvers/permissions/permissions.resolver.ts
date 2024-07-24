import { CreateManypermissionsArgs } from '@db/@generated/permissions/create-manypermissions.args';
import { CreateOnepermissionsArgs } from '@db/@generated/permissions/create-onepermissions.args';
import { DeleteManypermissionsArgs } from '@db/@generated/permissions/delete-manypermissions.args';
import { DeleteOnepermissionsArgs } from '@db/@generated/permissions/delete-onepermissions.args';
import { FindManypermissionsArgs } from '@db/@generated/permissions/find-manypermissions.args';
import { FindUniquepermissionsArgs } from '@db/@generated/permissions/find-uniquepermissions.args';
import { permissionsAggregateArgs } from '@db/@generated/permissions/permissions-aggregate.args';
import { UpdateManypermissionsArgs } from '@db/@generated/permissions/update-manypermissions.args';
import { UpdateOnepermissionsArgs } from '@db/@generated/permissions/update-onepermissions.args';
import { DBService } from '@db/db.service';
import { HttpStatus } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthType } from 'common/enums/auth-type.enum';
import { Auth } from '../../../auth/decorator/auth.decorator';
import {
  AggregatePermissionsResponse,
  CreateManyOutputResponse,
  PermissionsResponse,
  UniquePermissionsResponse,
} from '../../dto/responses.dto';

@Resolver()
export class PermissionsResolver {
  constructor(private prisma: DBService) {}

  /* 
  
  CRUD operations for permissions 
  
  */

  @Query(() => UniquePermissionsResponse)
  @Auth(AuthType.NONE)
  async permissions_by_pk(@Args() data: FindUniquepermissionsArgs): Promise<UniquePermissionsResponse> {
    console.log('data', data);
    const permissions = await this.prisma.permissions.findUnique(data);
    return {
      message: 'Permissions fetched successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: permissions,
    };
  }

  @Query(() => AggregatePermissionsResponse)
  @Auth(AuthType.NONE)
  async permissions_aggregate(@Args() data: permissionsAggregateArgs): Promise<AggregatePermissionsResponse> {
    const permissions = await this.prisma.permissions.aggregate(data);
    return {
      message: 'Module fetched successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: permissions,
    };
  }

  @Query(() => PermissionsResponse)
  @Auth(AuthType.NONE)
  async permissions(@Args() data: FindManypermissionsArgs): Promise<PermissionsResponse> {
    const permissions = await this.prisma.permissions.findMany({
      ...data,
      include: { role_permissions: true, modules: true },
    });
    return {
      message: 'permissions fetched successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: permissions,
    };
  }

  @Mutation(() => UniquePermissionsResponse)
  @Auth(AuthType.NONE)
  async insert_permissions_one(@Args() data: CreateOnepermissionsArgs): Promise<UniquePermissionsResponse> {
    const module = await this.prisma.permissions.create(data);
    return {
      message: 'permissions created successfully',
      statusCode: HttpStatus.CREATED,
      status: 'Success',
      data: module,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async insert_permissions(@Args() data: CreateManypermissionsArgs): Promise<CreateManyOutputResponse> {
    const module = await this.prisma.permissions.createMany(data);
    console.log(module);
    return {
      message: 'permissions created successfully',
      statusCode: HttpStatus.CREATED,
      status: 'Success',
      data: module,
    };
  }

  @Mutation(() => UniquePermissionsResponse)
  @Auth(AuthType.NONE)
  async update_permissions(@Args() data: UpdateOnepermissionsArgs): Promise<UniquePermissionsResponse> {
    const module = await this.prisma.permissions.update(data);
    return {
      message: 'permissions updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: module,
    };
  }

  @Mutation(() => UniquePermissionsResponse)
  @Auth(AuthType.NONE)
  async update_permissions_by_pk(@Args() data: UpdateOnepermissionsArgs): Promise<UniquePermissionsResponse> {
    const module = await this.prisma.permissions.update({
      ...data,
      include: { role_permissions: true, modules: true, user_permissions: true },
    });
    return {
      message: 'permissions updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: module,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async update_many_permissions(@Args() data: UpdateManypermissionsArgs): Promise<CreateManyOutputResponse> {
    const module = await this.prisma.permissions.updateMany(data);
    return {
      message: 'permissions updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: module,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async delete_permissions(@Args() data: DeleteManypermissionsArgs): Promise<CreateManyOutputResponse> {
    const module = await this.prisma.permissions.deleteMany(data);

    return {
      message: 'permissions deleted successfully',
      statusCode: 200,
      status: 'Success',
      data: module,
    };
  }

  @Mutation(() => UniquePermissionsResponse)
  @Auth(AuthType.NONE)
  async delete_permissions_by_pk(@Args() data: DeleteOnepermissionsArgs): Promise<UniquePermissionsResponse> {
    return this.prisma.permissions.delete(data);
  }
}
