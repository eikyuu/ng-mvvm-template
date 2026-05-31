import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 class="text-6xl font-bold">404</h1>
      <p class="text-lg opacity-80">Cette page n'existe pas.</p>
      <a routerLink="/" class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Retour à l'accueil
      </a>
    </section>
  `,
})
export class NotFoundComponent {}
