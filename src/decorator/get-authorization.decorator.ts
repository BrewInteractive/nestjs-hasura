import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetAuthorization = createParamDecorator(
  (_: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.headers['authorization'];
  },
);