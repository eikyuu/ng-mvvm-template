import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { LoggerService } from '../services/logger.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      logger.error(`[HTTP ${error.status}] ${req.method} ${req.url}`, error.message);
      return throwError(() => error);
    }),
  );
};
