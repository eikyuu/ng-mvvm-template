import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { APP_ENV } from '@core/config/app.config.token';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { GlobalErrorHandler } from '@core/services/global-error-handler';
import { environment } from '@env/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor])),
    provideClientHydration(withEventReplay()),
    { provide: APP_ENV, useValue: environment },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
