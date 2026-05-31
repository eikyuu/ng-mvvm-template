import { InjectionToken } from '@angular/core';

export interface AppEnvironment {
  readonly appName: string;
  readonly production: boolean;
  readonly apiBaseUrl: string;
}

/**
 * Injecte l'environnement courant.
 * Fourni dans app.config.ts afin de pouvoir être remplacé dans les tests via TestBed.
 */
export const APP_ENV = new InjectionToken<AppEnvironment>('APP_ENV');
