import { HasuraErrorBase } from './hasura-error-base';

export class AdminSecretNotFound extends HasuraErrorBase {
  constructor() {
    super('Missing admin secret.');
  }
}
