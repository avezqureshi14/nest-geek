import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './guards/permissions/permission.guard';
import { ModulesResolver } from './resolvers/modules/modules.resolver';
import { PermissionsResolver } from './resolvers/permissions/permissions.resolver';
import { RolesResolver } from './resolvers/roles/roles.resolver';
import { RolesPermissionsResolver } from './resolvers/roles_permission/roles_permission.resolver';
import { UsersResolver } from './resolvers/users/users.resolver';
import { UsersPermissionsResolver } from './resolvers/users_permissions/users_permissions.resolver';
import { UsersRolesResolver } from './resolvers/users_roles/users_roles.resolver';
import { DBModule } from '../db/db.module';

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [
    RolesResolver,
    PermissionsResolver,
    ModulesResolver,
    UsersResolver,
    UsersPermissionsResolver,
    RolesPermissionsResolver,
    UsersRolesResolver,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AuthorizationModule {}
