# ng-mvvm-template — Guide Claude Code

Template Angular 22+, **MVVM**, **signals-only**, **zoneless**, **SSR**, Vitest, Tailwind v4.

Lis aussi : `docs/ARCHITECTURE.md`, `docs/BEST-PRACTICES.md`, `docs/CONVENTIONS.md`, `docs/SETUP.md`.

> Les conventions détaillées par couche vivent dans `.claude/rules/` (chargées selon le fichier en cours d'édition). Ce fichier ne garde que ce qui s'applique partout et au **moment de créer** une feature.

## Règle d'or — la triade MVVM

**Toute feature respecte la triade MVVM** :

```
src/app/features/<feature>/
├── model/        # interfaces, types, constantes (readonly)
├── viewmodel/    # @Injectable() — signals + intents
└── view/         # composant standalone, OnPush
```

- **View** lit les signals et délègue les intents. Pas de logique métier.
- **ViewModel** possède l'état (signals privés `_xxx`, exposés via `asReadonly()` ou `computed()`). Pas de DOM, pas de HTTP direct.
- **Model** = formes de données immutables. Aucune logique.

Le ViewModel est **scoped au composant** via `providers: [XxxViewModel]`, pas `providedIn: 'root'`.

## Conventions de nommage (au moment de créer un fichier)

- Suffixes obligatoires : `View`, `ViewModel`, `Service`, `Repository`, `Component` (UI partagé).
- Fichiers en kebab-case : `counter.view.ts`, `counter.viewmodel.ts`, `user.repository.ts`.
- Préfixe sélecteur : `app-` (kebab-case pour composants, camelCase pour directives).

## Path aliases (à utiliser systématiquement)

| Alias         | Cible                |
| ------------- | -------------------- |
| `@core/*`     | `src/app/core/*`     |
| `@shared/*`   | `src/app/shared/*`   |
| `@features/*` | `src/app/features/*` |
| `@data/*`     | `src/app/data/*`     |
| `@layouts/*`  | `src/app/layouts/*`  |
| `@env/*`      | `src/environments/*` |

Privilégier les alias dès qu'on sort du dossier courant. **Jamais** de `../../../../`.

## Stack technique

- Angular 22.x, standalone, zoneless (`provideZonelessChangeDetection`).
- TypeScript 6.0 (`typescript ~6.0.x`).
- SSR + hydration (`provideClientHydration(withEventReplay(), withNoIncrementalHydration())`).
- Routing : lazy uniquement (`loadComponent`), `withComponentInputBinding()`, `withViewTransitions()`.
- Vitest via `@angular/build:unit-test` (`runner: vitest`, env jsdom).
- Tailwind v4 (`src/tailwind.css`).
- ESLint (`@angular-eslint`) + Prettier + `prettier-plugin-tailwindcss`.
- Husky + lint-staged + commitlint (conventional-commits).
- CI GitHub Actions, release-please.

## Routing (au moment de créer une route)

- 100% lazy : `loadComponent: () => import('@features/x/view/x.view').then(m => m.XView)`.
- Guards et resolvers en **fonctions** (`CanActivateFn`, `ResolveFn`).
- `withComponentInputBinding()` ⇒ params de route exposés via `input()`.
- URLs en kebab-case minuscule.

## Environments (transversal)

- Consommer via le token `APP_ENV`, jamais par import direct :
  ```ts
  const env = inject(APP_ENV);
  ```
- Ne JAMAIS importer `environment.ts` directement depuis un composant ou ViewModel (testabilité).
- `@env/environment` (dev) → remplacé par `environment.prod.ts` au build prod (`fileReplacements`).

## Commits (conventional-commits, verrouillés)

Format : `<type>(<scope>?): <sujet>`

Types autorisés : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

- Sujet en **minuscule**, impératif présent, pas de point final, ≤ 100 caractères.
- `feat` ⇒ bump minor ; `fix` ⇒ bump patch ; `BREAKING CHANGE:` en footer ⇒ bump major (release-please).

## Commandes à lancer

Avant tout commit ou PR :

```bash
npm run lint
npm test
npm run build
```

`npm run format` si nécessaire. Le pre-commit hook (lint-staged) le fait sur les fichiers stagés.
**Ne jamais** bypasser les hooks avec `--no-verify` — corriger plutôt que contourner.
