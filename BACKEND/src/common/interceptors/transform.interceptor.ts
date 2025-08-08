import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();
  
      return next.handle().pipe(
        map((data) => ({
          code: response.statusCode || 200,
          message: data?.message || 'Thành công',
          result: data?.result ?? data,
        })),
      );
    }
  }
  