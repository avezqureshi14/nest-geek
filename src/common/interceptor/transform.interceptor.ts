import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ApiResponse } from 'common/dto/api-response';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: data.statusCode ? data.statusCode : context.switchToHttp().getResponse().statusCode,
        status: data.status,
        message: data.message,
        data: data.data,
        error: data.error,
      }))
    );
  }
}
