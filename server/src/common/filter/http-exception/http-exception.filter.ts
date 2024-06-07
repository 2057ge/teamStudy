import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    //const { message, error } = Object(exception.getResponse());
    response.status(status).json({
      error: exception,
      statusCode: status,
      timestamp: new Date().toLocaleString('zh-cn'),
      path: request.url,
    });
  }
}
