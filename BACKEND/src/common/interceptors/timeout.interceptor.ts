import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    RequestTimeoutException,
  } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

  
  @Injectable()
  export class TimeoutInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector, 
        private readonly defaultMs: number = 300000,
    ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skipTimeout = this.reflector.getAllAndOverride<boolean>(
        "skipTimeout",
      [context.getHandler(), context.getClass()],
    );

    if (skipTimeout) {
      return next.handle(); // Không áp timeout
    }

    return next.handle().pipe(
      timeout(this.defaultMs),
      catchError(err =>
        err instanceof TimeoutError
          ? throwError(() => new RequestTimeoutException('Request timeout'))
          : throwError(() => err),
      ),
    );
  }
  }
  