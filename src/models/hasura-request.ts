import { RunQueryFlags } from './run-query-flags';
import { RunQueryOptions } from './run-query-options';

export class HasuraRequest<V = unknown> {
  query: string;
  variables?: V;
  headers?: Record<string, string>;
  runQueryFlag?: RunQueryFlags;
  runQueryOptions?: RunQueryOptions;
}
