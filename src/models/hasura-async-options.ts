import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

import { HasuraOptions } from './hasura-options';

export type HasuraAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<HasuraOptions>, 'useFactory' | 'inject'>;
