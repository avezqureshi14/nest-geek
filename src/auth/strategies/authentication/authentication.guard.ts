import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlAuthGuard } from './jwt-token/graphql-jwt-auth.guard';
import { JwtAuthGuard } from './jwt-token/jwt-auth.guard';
import { GqlRefreshGuard } from './refresh-token/graphql-refresh-auth.guard';
import { RefreshAuthGuard } from './refresh-token/refresh-auth.guard';
import { AUTH_TYPE_KEY } from '../../../auth/decorator/auth.decorator';
import { AuthType } from '../../../common/enums/auth-type.enum';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.JWT;
  private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]> = {
    [AuthType.JWT]: this.jwtGuard,
    [AuthType.REFRESH]: this.refreshGuard,
    [AuthType.GRAPHQL_JWT]: this.gqlAuthGuard,
    [AuthType.GRAPHQL_REFRESH]: this.gqlRefreshGuard,
    [AuthType.SUBSCRIPTION]: [this.jwtGuard, this.gqlAuthGuard],
    [AuthType.NONE]: { canActivate: () => true },
  };
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtGuard: JwtAuthGuard,
    private readonly gqlAuthGuard: GqlAuthGuard,
    private readonly gqlRefreshGuard: GqlRefreshGuard,
    private readonly refreshGuard: RefreshAuthGuard
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    let error = new UnauthorizedException();
    for (const instance of guards) {
      const canActivate = await Promise.resolve(instance.canActivate(context)).catch((err) => {
        error = err;
      });

      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
