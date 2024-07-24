import { modules } from '@db/@generated/modules/modules.model';
import { permissions } from '@db/@generated/permissions/permissions.model';
import { AggregateModules } from '@db/@generated/prisma/aggregate-modules.output';
import { AggregatePermissions } from '@db/@generated/prisma/aggregate-permissions.output';
import { AggregateRoles } from '@db/@generated/prisma/aggregate-roles.output';
import { AggregateUsers } from '@db/@generated/prisma/aggregate-users.output';
import { roles } from '@db/@generated/roles/roles.model';
import { users } from '@db/@generated/users/users.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQlApiResponse } from 'common/dto/graphql-response';

@ObjectType()
export class UniqueModulesResponse extends GraphQlApiResponse(modules) {}
@ObjectType()
export class UniquePermissionsResponse extends GraphQlApiResponse(permissions) {}
@ObjectType()
export class UniqueRolesResponse extends GraphQlApiResponse(roles) {}
@ObjectType()
export class UniqueUsersResponse extends GraphQlApiResponse(users) {}

@ObjectType()
export class ModulesResponse extends GraphQlApiResponse([modules]) {}

@ObjectType()
export class PermissionsResponse extends GraphQlApiResponse([permissions]) {}
@ObjectType()
export class RolesResponse extends GraphQlApiResponse([roles]) {}
@ObjectType()
export class UsersResponse extends GraphQlApiResponse([users]) {}
@ObjectType()
export class AggregateModulesResponse extends GraphQlApiResponse(AggregateModules) {}
@ObjectType()
export class AggregatePermissionsResponse extends GraphQlApiResponse(AggregatePermissions) {}
@ObjectType()
export class AggregateRolesResponse extends GraphQlApiResponse(AggregateRoles) {}
@ObjectType()
export class AggregateUsersResponse extends GraphQlApiResponse(AggregateUsers) {}

@ObjectType()
export class CrudManyOutput {
  @Field(() => Number, { nullable: false })
  count: number;
}
@ObjectType()
export class CreateManyOutputResponse extends GraphQlApiResponse(CrudManyOutput) {}
