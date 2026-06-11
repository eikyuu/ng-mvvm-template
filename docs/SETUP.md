# Setup & Outillage

Description de l'outillage transverse fourni par le template.

## Versions Node

Fichier de référence : **`.nvmrc`** → `22.22.3`.
Verrouillage dans `package.json` :

```json
"engines": { "node": ">=22.22.3", "npm": ">=10.9.0" }
```

`npm ci` échouera si la version locale est trop basse.

## Path aliases TypeScript

Configurés dans `tsconfig.json` :

| Alias         | Pointe vers          |
| ------------- | -------------------- |
| `@core/*`     | `src/app/core/*`     |
| `@shared/*`   | `src/app/shared/*`   |
| `@features/*` | `src/app/features/*` |
| `@data/*`     | `src/app/data/*`     |
| `@layouts/*`  | `src/app/layouts/*`  |
| `@env/*`      | `src/environments/*` |

Exemple :

```ts
import { LoggerService } from '@core/services/logger.service';
import { environment } from '@env/environment';
```

Privilégier les alias sur les chemins relatifs dès qu'on sort du dossier courant.

## Environments

Deux fichiers dans `src/environments/` :

- `environment.ts` — défaut (dev)
- `environment.prod.ts` — substitué au build production via `fileReplacements` dans `angular.json`

Les deux exportent une constante `environment` typée `AppEnvironment`.
La valeur est fournie via `APP_ENV` dans `app.config.ts` :

```ts
{ provide: APP_ENV, useValue: environment }
```

Consommation dans un service :

```ts
const env = inject(APP_ENV);
http.get(`${env.apiBaseUrl}/users`);
```

Ne **jamais** importer `environment.ts` directement depuis un composant ou un ViewModel — passer toujours par le token (testabilité).

## ErrorHandler global

`GlobalErrorHandler` (`@core/services/global-error-handler.ts`) intercepte toutes les erreurs non rattrapées. C'est le point unique pour brancher Sentry/Datadog/Bugsnag.

```ts
// app.config.ts
{ provide: ErrorHandler, useClass: GlobalErrorHandler }
```

## Lint-staged + Husky

| Hook         | Action                                                               |
| ------------ | -------------------------------------------------------------------- |
| `pre-commit` | `lint-staged` → eslint + prettier sur les fichiers stagés uniquement |
| `commit-msg` | `commitlint` valide la convention                                    |

Configuration dans `.lintstagedrc.json` :

```json
{
  "*.{ts,html}": ["eslint --fix", "prettier --write"],
  "*.{scss,json,md}": ["prettier --write"]
}
```

Bénéfice : pre-commit reste rapide même sur un gros repo.

## Prettier + Tailwind

Plugin `prettier-plugin-tailwindcss` activé → les classes Tailwind sont automatiquement triées dans l'ordre canonique. Aucune action manuelle.

## CI GitHub Actions

`.github/workflows/ci.yml` tourne sur chaque PR vers `main` et chaque push sur `main` :

1. `format:check`
2. `lint`
3. `test`
4. `build`

Concurrence : un push annule les jobs en cours sur la même branche.

## Release Please

`.github/workflows/release-please.yml` + `release-please-config.json` :

- Lit les commits conventional-commits sur `main`.
- Maintient automatiquement une PR de release contenant :
  - bump de version dans `package.json` (semver dérivé des types : `feat` ⇒ minor, `fix` ⇒ patch, `BREAKING CHANGE` ⇒ major)
  - `CHANGELOG.md` généré
- Quand la PR est mergée → tag git, GitHub release, version publiée.

Aucune intervention manuelle. La cohérence avec commitlint est totale.

## PR template

`.github/PULL_REQUEST_TEMPLATE.md` — checklist MVVM/signals/tests à valider pour chaque PR.

## Scripts utiles

```bash
npm run lint          # ESLint sur src/
npm run lint:fix      # auto-fix
npm run format        # Prettier --write
npm run format:check  # Prettier --check (CI)
npm test              # Vitest
npm run test:watch    # Vitest watch
npm run test:coverage # Vitest avec couverture
npm run build         # Build prod (avec SSR + prerender)
npm start             # Dev server
```
