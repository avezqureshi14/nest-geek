import { SetMetadata } from '@nestjs/common';

export const CheckPermissions = (...permissions: number[]) => SetMetadata('permissions', permissions);
