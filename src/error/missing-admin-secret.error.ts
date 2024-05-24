import { HasuraErrorBase } from './hasura-error-base.error';

export class MissingAdminSecret extends HasuraErrorBase {
  constructor() {
    super('Missing admin secret.');
  }
}
