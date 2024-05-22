import { DynamicModule, Module } from '@nestjs/common';
import { HasuraAsyncConfig, HasuraConfig } from './models';

import { HasuraService } from './hasura.service';

@Module({})
export class HasuraModule {
  static register(config: HasuraConfig): DynamicModule {
    return {
      module: HasuraModule,
      global: false,
      providers: [
        HasuraService,
        {
          provide: HasuraConfig,
          useValue: config,
        },
      ],
      exports: [HasuraService],
    };
  }

  static registerAsync(config: HasuraAsyncConfig): DynamicModule {
    return {
      module: HasuraModule,
      global: false,
      imports: config.imports,
      providers: [
        HasuraService,
        {
          provide: HasuraConfig,
          useFactory: config.useFactory,
          inject: config.inject,
        },
      ],
      exports: [HasuraService],
    };
  }

  static forRoot(config: HasuraConfig): DynamicModule {
    return {
      ...this.register(config),
      global: true,
    };
  }

  static forRootAsync(config: HasuraAsyncConfig): DynamicModule {
    return {
      ...this.registerAsync(config),
      global: true,
    };
  }
}
