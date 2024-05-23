import { AuthorizationOptions } from './authorization-options';
import { RequestFlags } from './request-flags';

export class HasuraRequest<V = unknown> {
  query: string;
  variables?: V;
  headers?: Record<string, string>;
  requestFlags?: RequestFlags;
  authorizationOptions?: AuthorizationOptions;
}
