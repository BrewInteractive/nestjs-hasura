import { ErrorExtensions } from './error-extensions.dto';

export class ErrorResponse {
  message: string;
  extensions: ErrorExtensions;
}
