# Using the Hasura Service

To use the HasuraService, inject it where needed.

## Query & Mutation Request

| Parameter Name       | Description                                                                                                                                           | Is Required ? |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| query                | Represents the query or mutation you will send.                                                                                                       | Yes           |
| variables            | You can send the variables in the query or mutation with this parameter.                                                                              | No            |
| headers              | You can use this parameter if you want to pass custom header during Hasura request.                                                                   | No            |
| authorizationOptions | You can pass authorization parameters here.                                                                                                           | No            |
| requestFlags         | You can define Hasura properties using [RequestFlags](https://github.com/BrewInteractive/nestjs-hasura-module/blob/main/src/models/request-flags.ts). | No            |

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

### Running Queries with Authorization Options

| Option Name        | Description                                                                 | Is Required ? |
| ------------------ | --------------------------------------------------------------------------- | ------------- |
| role               | Pass the `x-hasura-role` parameter to the header during the Hasura request. | No            |
| authorizationToken | Pass the `Authorization` parameter to the header during the Hasura request. | No            |

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
    const authorizationOptions: AuthorizationOptions = {
      role: 'admin',
      authorizationToken: 'my-token',
    };

    const result = await this.hasuraService.requestAsync({
      query,
      variables,
      authorizationOptions,
    });
    return result;
  }
}
```

### Running Queries with Custom Headers

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
    const headers = { 'x-hasura-role': 'admin' };
    const result = await this.hasuraService.requestAsync({
      query,
      variables,
      headers,
    });
    return result;
  }
}
```

### Running Queries with Request Flags

```ts
import { Injectable } from '@nestjs/common';
import { HasuraService, RequestFlags } from '@brewww/nestjs-hasura-module';
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
    const requestFlags = RequestFlags.UseAdminSecret;
    const result = await this.hasuraService.requestAsync({
      query,
      variables,
      requestFlags,
    });
    return result;
  }
}
```
