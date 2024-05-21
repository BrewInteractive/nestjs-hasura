export abstract class HasuraErrorBase extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super();
    this.code = code;
    this.message = message;
  }
}
