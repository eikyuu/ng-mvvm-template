# ng-mvvm-template

Template Angular 22+ réutilisable, prêt pour 2026.

**Stack** : Angular 22 · TypeScript 6 · standalone · zoneless · signals-only · SSR · Vitest · Tailwind v4 · MVVM · ESLint · commitlint · lint-staged · release-please · CI GitHub Actions.

## Démarrage

```bash
nvm use              # Node 22.12+
npm install
npm start            # dev server
npm run build        # build prod (avec SSR + prerender)
npm test             # vitest
npm run lint
npm run format
```

## Caractéristiques

### Architecture & code

- **MVVM** strictement séparée (`model/` / `viewmodel/` / `view/`).
- **Signals uniquement** (`signal`, `computed`, `linkedSignal`, `resource`, `effect`) — pas d'`Observable` côté state.
- **Zoneless change detection** (`provideZonelessChangeDetection`).
- **SSR + hydration** prêts (`@angular/ssr`, `withEventReplay`).
- **Lazy routes** uniquement, via `loadComponent`.
- **Path aliases** : `@core`, `@shared`, `@features`, `@data`, `@layouts`, `@env`.
- **Environments typés** avec `fileReplacements` au build prod, injectés via `APP_ENV`.
- **ErrorHandler global** prêt à brancher Sentry/Datadog.

### Tests & qualité

- **Vitest** branché sur le builder Angular `@angular/build:unit-test`.
- **ESLint** avec règles Angular strictes (`prefer-signals`, `prefer-on-push`, control flow, a11y).
- **Prettier** + `prettier-plugin-tailwindcss` (tri auto des classes).
- **Lint-staged** : pre-commit qui ne touche que les fichiers stagés.
- **Conventional commits** verrouillés par commitlint + husky.

### CI / Release

- **GitHub Actions** : lint + test + build sur chaque PR et push.
- **Release Please** : changelog + versioning sémantique automatiques depuis les commits.
- **PR template** avec checklist MVVM.

### UI

- **Tailwind v4** intégré.

## Structure

```
src/
├── app/
│   ├── core/         # singletons (services, guards, interceptors, tokens, config)
│   ├── shared/       # composants UI, directives, pipes, utils
│   ├── data/         # models, repositories, http
│   ├── features/     # une feature = model/ + viewmodel/ + view/
│   └── layouts/      # layouts d'application
└── environments/     # environment.ts + environment.prod.ts
```

Exemple complet : `src/app/features/counter/`.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — MVVM, arborescence, communication.
- [`docs/BEST-PRACTICES.md`](docs/BEST-PRACTICES.md) — règles Angular 2026.
- [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) — nommage, commits.
- [`docs/SETUP.md`](docs/SETUP.md) — outillage (aliases, environments, CI, release-please…).
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — workflow de contribution.

## Réutiliser ce template

1. Cloner / fork.
2. Renommer le projet dans `package.json`, `angular.json`, `release-please-config.json`, `src/environments/*`.
3. Mettre à jour `LICENSE` (titulaire du copyright).
4. `nvm use && npm install` — le script `prepare` installe les hooks husky.
5. Adapter `src/environments/environment.prod.ts` (URL d'API, etc.).
6. Premier commit en suivant `<type>(<scope>): <sujet>`.

## Licence

[MIT](LICENSE)
