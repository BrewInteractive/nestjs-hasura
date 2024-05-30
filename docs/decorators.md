# Decorators

## AuthorizationToken Decorator

Allows to get Authorization token by removing `Bearer` part in the authorization header of the incoming request.

```ts
import { Controller, Get } from '@nestjs/common';
import { AuthorizationToken } from '@brewww/nestjs-hasura-module';

@Controller()
export class ProtectedController {
  @Get('/resource')
  async getProtectedResource(@AuthorizationToken() authorizationToken: string) {
    console.log('Authorization token:', authorizationToken);
    return { message: 'Access granted to protected resource' };
  }
}
```
