import { CreateManymodulesArgs } from '@db/@generated/modules/create-manymodules.args';
import { CreateOnemodulesArgs } from '@db/@generated/modules/create-onemodules.args';
import { DeleteManymodulesArgs } from '@db/@generated/modules/delete-manymodules.args';
import { DeleteOnemodulesArgs } from '@db/@generated/modules/delete-onemodules.args';
import { FindManymodulesArgs } from '@db/@generated/modules/find-manymodules.args';
import { FindUniquemodulesArgs } from '@db/@generated/modules/find-uniquemodules.args';
import { modulesAggregateArgs } from '@db/@generated/modules/modules-aggregate.args';
import { UpdateManymodulesArgs } from '@db/@generated/modules/update-manymodules.args';
import { UpdateOnemodulesArgs } from '@db/@generated/modules/update-onemodules.args';
import { DBService } from '@db/db.service';
import { HttpStatus } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthType } from 'common/enums/auth-type.enum';
import { Auth } from '../../../auth/decorator/auth.decorator';
import {
  AggregateModulesResponse,
  CreateManyOutputResponse,
  ModulesResponse,
  UniqueModulesResponse,
} from '../../dto/responses.dto';

@Resolver()
export class ModulesResolver {
  constructor(private prisma: DBService) {}

  /* 
  
  CRUD operations for modules 
  
  */

  @Query(() => UniqueModulesResponse)
  @Auth(AuthType.NONE)
  async modules_by_pk(@Args() data: FindUniquemodulesArgs): Promise<UniqueModulesResponse> {
    const modules = await this.prisma.modules.findUnique(data);
    return {
      message: 'Module fetched successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: modules,
    };
  }

  @Query(() => AggregateModulesResponse)
  @Auth(AuthType.NONE)
  async modules_aggregate(@Args() data: modulesAggregateArgs): Promise<AggregateModulesResponse> {
    const modules = await this.prisma.modules.aggregate(data);
    return {
      message: 'Module fetched successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: modules,
    };
  }

  @Query(() => ModulesResponse)
  @Auth(AuthType.NONE)
  async modules(@Args() data: FindManymodulesArgs): Promise<ModulesResponse> {
    const modules = await this.prisma.modules.findMany({ ...data, include: { permissions: true } });
    return {
      message: 'Modules fetched successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: modules,
    };
  }

  @Mutation(() => UniqueModulesResponse)
  @Auth(AuthType.NONE)
  async insert_modules_one(@Args() data: CreateOnemodulesArgs): Promise<UniqueModulesResponse> {
    const module = await this.prisma.modules.create(data);
    return {
      message: 'Modules created successfully',
      statusCode: HttpStatus.CREATED,
      status: 'Success',
      data: module,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async insert_modules(@Args() data: CreateManymodulesArgs): Promise<CreateManyOutputResponse> {
    const module = await this.prisma.modules.createMany(data);
    console.log(module);
    return {
      message: 'Modules created successfully',
      statusCode: HttpStatus.CREATED,
      status: 'Success',
      data: module,
    };
  }

  @Mutation(() => UniqueModulesResponse)
  @Auth(AuthType.NONE)
  async update_modules_by_pk(@Args() data: UpdateOnemodulesArgs): Promise<UniqueModulesResponse> {
    const module = await this.prisma.modules.update(data);
    return {
      message: 'Modules updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: module,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async update_many_modules(@Args() data: UpdateManymodulesArgs): Promise<CreateManyOutputResponse> {
    const module = await this.prisma.modules.updateMany(data);
    return {
      message: 'Modules updated successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: module,
    };
  }

  @Mutation(() => CreateManyOutputResponse)
  @Auth(AuthType.NONE)
  async delete_modules(@Args() data: DeleteManymodulesArgs): Promise<CreateManyOutputResponse> {
    const module = await this.prisma.modules.deleteMany(data);

    return {
      message: 'Modules deleted successfully',
      statusCode: 200,
      status: 'Success',
      data: module,
    };
  }

  @Mutation(() => UniqueModulesResponse)
  @Auth(AuthType.NONE)
  async delete_modules_by_pk(@Args() data: DeleteOnemodulesArgs): Promise<UniqueModulesResponse> {
    return this.prisma.modules.delete(data);
  }
}
