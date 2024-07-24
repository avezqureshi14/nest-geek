import { SetMetadata } from '@nestjs/common';

export const CheckRoles = (...roles: number[]) => SetMetadata('roles', roles);
