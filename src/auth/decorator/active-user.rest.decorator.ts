import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ActiveUser = createParamDecorator((field: string | undefined, ctx: ExecutionContext) => {
  const requset = ctx.switchToHttp().getRequest();
  const user = requset['user'];
  return field ? user[field] : user;
});
