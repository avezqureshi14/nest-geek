import { CreateManyrolesArgs } from '@db/@generated/roles/create-manyroles.args';
import { CreateOnerolesArgs } from '@db/@generated/roles/create-oneroles.args';
import { DeleteManyrolesArgs } from '@db/@generated/roles/delete-manyroles.args';
import { DeleteOnerolesArgs } from '@db/@generated/roles/delete-oneroles.args';
import { FindManyrolesArgs } from '@db/@generated/roles/find-manyroles.args';
import { FindUniquerolesArgs } from '@db/@generated/roles/find-uniqueroles.args';
import { rolesAggregateArgs } from '@db/@generated/roles/roles-aggregate.args';
import { UpdateManyrolesArgs } from '@db/@generated/roles/update-manyroles.args';
import { UpdateOnerolesArgs } from '@db/@generated/roles/update-oneroles.args';
import { DBService } from '@db/db.service';
import { HttpStatus } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthType } from 'common/enums/auth-type.enum';
import { Auth } from '../../../auth/decorator/auth.decorator';
import {
  AggregateRolesResponse,
  CreateManyOutputResponse,
  RolesResponse,
  UniqueRolesResponse,
} from '../../dto/responses.dto';

@Resolver()
export class RolesResolver {
  constructor(private prisma: DBService) {}

  /* 
  
  CRUD operations for roles 
  
  */

  @Query(() => UniqueRolesResponse)
  @Auth(AuthType.NONE)
  async roles_by_pk(@Args() data: FindUniquerolesArgs): Promise<UniqueRolesResponse> {
    const roles = await this.prisma.roles.findUnique(data);
    return {
      message: 'Permissions fetched successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: roles,
    };
  }

  @Query(() => AggregateRolesResponse)
  @Auth(AuthType.NONE)
  async roles_aggregate(@Args() data: rolesAggregateArgs): Promise<AggregateRolesResponse> {
    const roles = await this.prisma.roles.aggregate(data);
    return {
      message: 'Role fetched successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: roles,
    };
  }

  @Query(() => RolesResponse)
  @Auth(AuthType.NONE)
  async roles(@Args() data: FindManyrolesArgs): Promise<RolesResponse> {
    const roles = await this.prisma.roles.findMany({ ...data, include: { role_permissions: true } });
    return {
      message: 'roles fetched successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: roles,
    };
  }

  @Mutation(() => UniqueRolesResponse)
  @Auth(AuthType.NONE)
  async insert_roles_one(@Args() data: CreateOnerolesArgs): Promise<UniqueRolesResponse> {
    const role = await this.prisma.roles.create(data);
    return {
      message: 'roles created successfully',
      statusCode: HttpStatus.CREATED,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async insert_roles(@Args() data: CreateManyrolesArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.roles.createMany(data);
    return {
      message: 'roles created successfully',
      statusCode: HttpStatus.CREATED,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => UniqueRolesResponse)
  @Auth(AuthType.NONE)
  async update_roles(@Args() data: UpdateOnerolesArgs): Promise<UniqueRolesResponse> {
    const role = await this.prisma.roles.update(data);
    return {
      message: 'Roles updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => UniqueRolesResponse)
  @Auth(AuthType.NONE)
  async update_roles_by_pk(@Args() data: UpdateOnerolesArgs): Promise<UniqueRolesResponse> {
    const role = await this.prisma.roles.update(data);
    return {
      message: 'Roles updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async update_many_roles(@Args() data: UpdateManyrolesArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.roles.updateMany(data);
    return {
      message: 'roles updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async delete_roles(@Args() data: DeleteManyrolesArgs): Promise<CreateManyOutputResponse> {
    const role = await this.prisma.roles.deleteMany(data);

    return {
      message: 'roles deleted successfully',
      statusCode: 200,
      status: 'Success',
      data: role,
    };
  }

  @Mutation(() => UniqueRolesResponse)
  @Auth(AuthType.NONE)
  async delete_roles_by_pk(@Args() data: DeleteOnerolesArgs): Promise<UniqueRolesResponse> {
    const role = this.prisma.roles.delete(data);
    return {
      message: 'roles deleted successfully',
      statusCode: 200,
      status: 'Success',
      data: role,
    };
  }
}
