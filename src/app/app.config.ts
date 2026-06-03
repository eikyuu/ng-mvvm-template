import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
  withNoIncrementalHydration,
} from '@angular/platform-browser';

import { APP_ENV } from '@core/config/app.config.token';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { GlobalErrorHandler } from '@core/services/global-error-handler';
import { InMemoryTaskRepository, TaskRepository } from '@data/repositories/task.repository';
import { environment } from '@env/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    { provide: APP_ENV, useValue: environment },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: TaskRepository, useClass: InMemoryTaskRepository },
  ],
};
