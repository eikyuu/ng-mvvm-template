import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * Guard de route squelette — remplacer le prédicat par une vraie logique d'authentification.
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return router.createUrlTree(['/']);
  }
  return true;
};
