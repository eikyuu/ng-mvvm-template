import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { APP_ENV } from '@core/config/app.config.token';

@Component({
  selector: 'app-about-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-col gap-4">
      <h1 class="text-2xl font-semibold">À propos</h1>
      <p class="opacity-80">
        {{ env.appName }} — template Angular 21+ MVVM, signals-only, zoneless, SSR.
      </p>
      <dl class="grid grid-cols-2 gap-2 text-sm">
        <dt class="opacity-60">Environnement</dt>
        <dd>{{ env.production ? 'production' : 'développement' }}</dd>
        <dt class="opacity-60">API</dt>
        <dd>
          <code>{{ env.apiBaseUrl }}</code>
        </dd>
      </dl>
    </section>
  `,
})
export class AboutView {
  protected readonly env = inject(APP_ENV);
}
