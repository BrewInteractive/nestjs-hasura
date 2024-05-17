import { DynamicModule, Module } from '@nestjs/common';
import { HasuraAsyncOptions, HasuraOptions } from './models';

import { HasuraService } from './hasura.service';

@Module({})
export class HasuraModule {
  static register(options: HasuraOptions): DynamicModule {
    return {
      module: HasuraModule,
      global: false,
      providers: [
        HasuraService,
        {
          provide: HasuraOptions,
          useValue: options,
        },
      ],
      exports: [HasuraService],
    };
  }

  static registerAsync(options: HasuraAsyncOptions): DynamicModule {
    return {
      module: HasuraModule,
      global: false,
      providers: [
        HasuraService,
        {
          provide: HasuraOptions,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
      ],
      exports: [HasuraService],
    };
  }

  static forRoot(options: HasuraOptions): DynamicModule {
    return {
      ...this.register(options),
      global: true,
    };
  }

  static forRootAsync(options: HasuraAsyncOptions): DynamicModule {
    return {
      ...this.registerAsync(options),
      global: true,
    };
  }
}
