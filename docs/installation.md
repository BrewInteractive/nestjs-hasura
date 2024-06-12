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

The Hasura module, with its `register` and `registerAsync` methods, operates within the services, controllers, and other classes at the same level as the module it is imported into. However, services, controllers, and other classes in submodules do not utilize the features of the Hasura module.

```ts
import { HasuraModule } from '@brewww/nestjs-hasura-module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    HasuraModule.register({
      graphqlEndpoint: 'http://localhost:8080/v1/graphql',
      adminSecret: 'Admin Secret',
    })
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
```

The `register` method takes package configurations directly as parameters, while the `registerAsync` method allows you to fetch data from services like `ConfigService` and provide configurations dynamically through a method.

```ts
import { HasuraModule } from '@brewww/nestjs-hasura-module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HasuraModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          graphqlEndpoint: configService.get('HASURA_GRAPHQL_ENDPOINT'),
          adminSecret: configService.get('HASURA_ADMIN_SECRET'),
        };
      },
      inject: [ConfigService],
    })
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
```

#### `forRoot` and `forRootAsync`

The Hasura module, with its `forRoot` and `forRootAsync` methods, works at both the module level it is imported into and in submodules. By configuring one of the forRoot methods in `app.module.ts`, the Hasura module can be utilized across all classes in the project.

```ts
import { HasuraModule } from '@brewww/nestjs-hasura-module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    HasuraModule.forRoot({
      graphqlEndpoint: 'http://localhost:8080/v1/graphql',
      adminSecret: 'Admin Secret',
    })
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
```

The `forRoot` method takes package configurations directly as parameters, while the `forRootAsync` method allows you to fetch data from services like `ConfigService` and provide configurations dynamically through a method.

```ts
import { HasuraModule } from '@brewww/nestjs-hasura-module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
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
