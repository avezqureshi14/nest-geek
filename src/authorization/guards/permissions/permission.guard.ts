// permissions.guard.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { roleNames } from 'common/enums/roles_permissions.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector // private readonly authService: AuthorizationService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!permissions && !roles) {
      return true; // No permissions or roles specified, allow access
    }
    const ctx = GqlExecutionContext.create(context);
    let user = ctx.getContext().req.user;

    if (!user) {
      user = context.switchToHttp().getRequest()['user'];
    }

    if (permissions) {
      const userPermissions = user.permissions;
      const hasPermission = permissions.every((permission) => userPermissions.includes(permission));
      if (!hasPermission) {
        return false;
      }
    }

    if (roles) {
      const userRoles = user.roles;
      const hasRole = roles.some((role) => userRoles.includes(roleNames[role]));
      if (!hasRole) {
        return false;
      }
    }

    return true;
  }
}
