import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request: Express.Request = ctx.switchToHttp().getRequest();

  // Get specific field passed to GetUser()
  if (data) {
    // neat but dumb (maybe)
    // @ts-ignore
    return request.user[data];
  }

  return request.user;
});
