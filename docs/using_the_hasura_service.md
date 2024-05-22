# Using the Hasura Service

To use the HasuraService, inject it where needed.

## Query&Mutation Request

| Parameter Name | Description                                                                          | Is Required ? |
|----------------|--------------------------------------------------------------------------------------|---------------|
| query          | Represents the query or mutation you will send.                                      | Yes           |
| variables      | You can send the variables in the query or mutation with this parameter.             | No            |
| headers        | You can use this parameter if you want to pass custom header during Hasura request.  | No            |
| options        | Represents the settings you want to pass to the hasura specifically. If there is a parameter that needs to be added to the header, it adds it automatically.   | No            |


### Basic Usage
```ts
import { Injectable } from '@nestjs/common';
import { HasuraService } from '@brewww/nestjs-hasura-module';
import { gql } from 'graphql-request';

@Injectable()
export class BookService {
  constructor(private readonly hasuraService: HasuraService) {}

  async getBooks() {
    const query = gql`
      query {
        books {
          id
          title
        }
      }
    `;

    const result = await this.hasuraService.requestAsync({ query });
    return result;
  }
}
```

### Running Queries with Variables

```ts
import { Injectable } from '@nestjs/common';
import { HasuraService } from '@brewww/nestjs-hasura-module';
import { gql } from 'graphql-request';

@Injectable()
export class BookService {
  constructor(private readonly hasuraService: HasuraService) {}

  async getBookById(bookId: number) {
    const query = gql`
      query getBook($id: Int!) {
        books_by_id(id: $id) {
          id
          title
        }
      }
    `;

    const variables = { id: bookId };
    const result = await this.hasuraService.requestAsync({ query, variables });
    return result;
  }
}
```

### Running Queries with Hasura Options

| Option Name               | Description                                                                         | Is Required ? |
|---------------------------|-------------------------------------------------------------------------------------|---------------|
| role                      | Pass the `x-hasura-role` parameter to the header during the Hasura request.         | No            |
| authorization             | Pass the `Authorization` parameter to the header during the Hasura request.         | No            |
| useAdminSecret            | Pass the `x-hasura-admin-secret` parameter to the header during the Hasura request. | No            |
| useBackendOnlyPermissions | Pass the parameters `x-hasura-admin-secret` and `x-hasura-use-backend-only-permissions` to the header during the Hasura request. | No            |


```ts
import { Injectable } from '@nestjs/common';
import { HasuraService, HasuraOptions } from '@brewww/nestjs-hasura-module';
import { gql } from 'graphql-request';

@Injectable()
export class BookService {
  constructor(private readonly hasuraService: HasuraService) {}

  async getBookWithRole(bookId: number) {
    const query = gql`
      query getBook($id: Int!) {
        book_by_id(id: $id) {
          id
          title
        }
      }
    `;

    const variables = { id: bookId };
    const options: HasuraOptions = {
      role: 'admin',
      authorization: 'Bearer my-token',
      useBackendOnlyPermissions: true,
      useAdminSecret: true,
    };

    const result = await this.hasuraService.requestAsync({ query, variables, options });
    return result;
  }
}

```

### Running Queries with Headers

```ts
import { Injectable } from '@nestjs/common';
import { HasuraService } from '@brewww/nestjs-hasura-module';
import { gql } from 'graphql-request';

@Injectable()
export class BookService {
  constructor(private readonly hasuraService: HasuraService) {}

  async getBookById(bookId: number) {
    const query = gql`
      query getBook($id: Int!) {
        books_by_id(id: $id) {
          id
          title
        }
      }
    `;

    const variables = { id: bookId };
    const headers = { 'x-hasura-role': 'admin' }
    const result = await this.hasuraService.requestAsync({ query, variables, headers });
    return result;
  }
}
```