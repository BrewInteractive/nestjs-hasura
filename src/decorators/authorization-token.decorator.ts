import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthorizationToken = createParamDecorator(
  (_: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  },
);
