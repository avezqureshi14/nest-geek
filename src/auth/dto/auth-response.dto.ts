import { modules } from '@db/@generated/modules/modules.model';
import { permissions } from '@db/@generated/permissions/permissions.model';
import { AggregateModules } from '@db/@generated/prisma/aggregate-modules.output';
import { AggregatePermissions } from '@db/@generated/prisma/aggregate-permissions.output';
import { AggregateRoles } from '@db/@generated/prisma/aggregate-roles.output';
import { roles } from '@db/@generated/roles/roles.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQlApiResponse } from 'common/dto/graphql-response';
import { AuthResponseDto } from './auth-output.dto';
import { RenewTokenResponseDto } from './renew-token.dto';

@ObjectType()
export class AuthResponse extends GraphQlApiResponse(AuthResponseDto) {}

@ObjectType()
export class RenewTokenResponse extends GraphQlApiResponse(RenewTokenResponseDto) {}
