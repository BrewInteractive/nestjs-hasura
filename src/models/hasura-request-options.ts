import { HasuraOptions } from './hasura-options';

export class HasuraRequestOptions<V = unknown> {
  query: string;
  variables?: V;
  headers?: Record<string, string>;
  options?: HasuraOptions;
}
