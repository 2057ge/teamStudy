import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Request } from 'express';
interface DataType<T> {
  data: T;
}
@Injectable()
export class MyResponse<T = any> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<DataType<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          statusCode: 200,
          messages: '成功',
        };
      }),
    );
  }
}
