import { ErrorHandler, Injectable, inject } from '@angular/core';

import { LoggerService } from './logger.service';

/**
 * ErrorHandler global — point d'entrée unique pour les erreurs non capturées.
 * Brancher Sentry / Datadog / Bugsnag ici.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggerService);

  handleError(error: unknown): void {
    const normalized = error instanceof Error ? error : new Error(String(error));
    this.logger.error('[UncaughtError]', normalized.message, normalized.stack);
  }
}
