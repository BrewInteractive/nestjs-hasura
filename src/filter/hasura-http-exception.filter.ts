import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ErrorResponse } from '../dto/error-response.dto';
import { HasuraErrorBase } from '../error';
import { Response } from 'express';

@Catch(HttpException, HasuraErrorBase)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: HttpException | HasuraErrorBase, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let errorResponse: { status: number; errorContent: ErrorResponse };
    if (error instanceof HttpException)
      errorResponse = this.getHttpExceptionErrorResponse(error);
    else if (error instanceof HasuraErrorBase)
      errorResponse = this.getHasuraErrorResponse(error);

    response.status(errorResponse.status).json(errorResponse.errorContent);
  }

  private getExceptionMessage(exception: HttpException) {
    const errorResponse = exception.getResponse();
    return errorResponse['message'] || exception.message;
  }

  private getHttpExceptionErrorResponse(exception: HttpException) {
    const status = exception.getStatus();

    const errorResponse = new ErrorResponse();
    errorResponse.message = this.getExceptionMessage(exception);

    if (exception.cause) {
      if (exception.cause['message'])
        errorResponse.message = (exception.cause as Error).message;
      if (exception.cause['extensions'])
        errorResponse.extensions = exception.cause['extensions'];
    }

    return { status, errorContent: errorResponse };
  }

  private getHasuraErrorResponse(hasuraError: HasuraErrorBase) {
    const errorResponse = new ErrorResponse();
    errorResponse.message = hasuraError.message;
    if (hasuraError['code']) errorResponse.extensions.code = hasuraError.code;

    return {
      status: HttpStatus.BAD_REQUEST,
      errorContent: errorResponse,
    };
  }
}
