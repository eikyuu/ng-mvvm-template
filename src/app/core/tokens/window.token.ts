import { InjectionToken, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Accès à `window` compatible SSR.
 * Côté serveur, retourne `undefined` — toujours protéger avec `if (win)` avant utilisation.
 *
 * @example
 * const win = inject(WINDOW);
 * if (win) { win.localStorage.setItem('k', 'v'); }
 */
export const WINDOW = new InjectionToken<Window | undefined>('WINDOW', {
  providedIn: 'root',
  factory: () => inject(DOCUMENT).defaultView ?? undefined,
});
