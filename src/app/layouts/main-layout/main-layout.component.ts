import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { APP_ENV } from '@core/config/app.config.token';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-screen flex-col">
      <header
        class="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80"
      >
        <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <a routerLink="/" class="text-lg font-semibold tracking-tight">{{ env.appName }}</a>

          <nav aria-label="Navigation principale" class="flex gap-1 text-sm">
            @for (link of links; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="bg-zinc-200 dark:bg-zinc-700"
                [routerLinkActiveOptions]="{ exact: true }"
                class="rounded-md px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {{ link.label }}
              </a>
            }
          </nav>
        </div>
      </header>

      <main id="main" class="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <router-outlet />
      </main>

      <footer
        class="border-t border-zinc-200 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
      >
        <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span>© {{ year }} {{ env.appName }}</span>
          <span>v{{ env.production ? 'prod' : 'dev' }}</span>
        </div>
      </footer>
    </div>
  `,
})
export class MainLayoutComponent {
  protected readonly env = inject(APP_ENV);
  protected readonly year = new Date().getFullYear();
  protected readonly links = [
    { path: '/counter', label: 'Counter' },
    { path: '/about', label: 'À propos' },
  ] as const;
}
