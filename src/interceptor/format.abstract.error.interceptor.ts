import { AbstractError } from '@/common/dto/abstract/error.abstract';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

export class FormatAbstractErrorInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: AbstractError) => {
        const response = {
          code: 'SYSTEM_ERROR',
          message: (err as any).message,
          details: (err as any).response?.errors,
          cause: err.stack,
        };
        return throwError(() => new HttpException(response, 500));
      }),
    );
  }
}
