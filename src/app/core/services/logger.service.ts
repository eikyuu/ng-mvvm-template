import { isDevMode, Service } from '@angular/core';

@Service()
export class LoggerService {
  info(message: string, ...args: unknown[]): void {
    if (isDevMode()) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(`[ERROR] ${message}`, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    if (isDevMode()) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}
