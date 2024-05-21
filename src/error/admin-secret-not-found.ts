import { HasuraErrorBase } from './hasura-error-base';

export class AdminSecretNotFound extends HasuraErrorBase {
  constructor() {
    super('There is no admin secret information.');
  }
}
