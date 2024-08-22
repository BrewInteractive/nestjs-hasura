import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const HasuraAdminSecret = createParamDecorator(
  (_: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.headers['x-hasura-admin-secret'];
  },
);
