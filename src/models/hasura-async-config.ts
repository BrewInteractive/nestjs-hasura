import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

import { HasuraConfig } from './hasura-config';

export type HasuraAsyncConfig = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<HasuraConfig>, 'useFactory' | 'inject'>;
