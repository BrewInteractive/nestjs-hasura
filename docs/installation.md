# Hasura Module Installation

## Installing the Hasura Module Package

In a NestJS project, it is possible to use the [Hasura Module](https://www.npmjs.com/package/@brewww/nestjs-hasura-module) package by installing it. With this package you will be able to easily manage Hasura in your project.

```bash
npm i @brewww/nestjs-hasura-module --save
```

```bash
yarn add @brewww/nestjs-hasura-module
```

### Usage

HasuraModule can be configured via the `register`, `registerAsync`, `forRoot`, and `forRootAsync` methods. These methods determine how the module is configured and how Hasura services are initialized.

#### `register` and `registerAsync`

The `register` and `registerAsync` method configures the module by synchronously receiving a configuration object.

```ts
import { HasuraModule } from '@brewww/nestjs-hasura-module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HasuraModule.register({
      graphqlEndpoint: 'http://localhost:8080/v1/graphql',
      adminSecret: 'Admin Secret',
    }),
    // or
    HasuraModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          graphqlEndpoint: configService.get('HASURA_GRAPHQL_ENDPOINT'),
          adminSecret: configService.get('HASURA_ADMIN_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
```

#### `forRoot` and `forRootAsync`

The `forRoot` and `forRootAsync` methods are used for root module configuration and are typically called in the root module of the application.

```ts
import { HasuraModule } from '@brewww/nestjs-hasura-module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HasuraModule.forRoot({
      graphqlEndpoint: 'http://localhost:8080/v1/graphql',
      adminSecret: 'Admin Secret',
    }),
    // or
    HasuraModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          graphqlEndpoint: configService.get('HASURA_GRAPHQL_ENDPOINT'),
          adminSecret: configService.get('HASURA_ADMIN_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
```
