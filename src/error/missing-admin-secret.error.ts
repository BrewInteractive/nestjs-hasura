export class MissingAdminSecret extends Error {
  constructor() {
    super('Missing admin secret.');
  }
}
