# Decorator Uses

## AuthorizationToken Decorator

Allows to get `Authorization` in the header of the incoming request.

```ts
import { Controller, Get } from "@nestjs/common";
import { AuthorizationToken } from "@brewww/nestjs-hasura-module";

@Controller()
export class ProtectedController {
  @Get("/resource")
  async getProtectedResource(@AuthorizationToken() authorization: string) {
    console.log("Authorization header:", authorization);
    return { message: "Access granted to protected resource" };
  }
}
```
