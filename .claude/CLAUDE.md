# ng-mvvm-template — Guide Claude Code

Template Angular 21+, **MVVM**, **signals-only**, **zoneless**, **SSR**, Vitest, Tailwind v4.

Lis aussi : `docs/ARCHITECTURE.md`, `docs/BEST-PRACTICES.md`, `docs/CONVENTIONS.md`, `docs/SETUP.md`.

## Règle d'or

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

## Path aliases (à utiliser systématiquement)

| Alias         | Cible                  |
|---------------|------------------------|
| `@core/*`     | `src/app/core/*`       |
| `@shared/*`   | `src/app/shared/*`     |
| `@features/*` | `src/app/features/*`   |
| `@data/*`     | `src/app/data/*`       |
| `@layouts/*`  | `src/app/layouts/*`    |
| `@env/*`      | `src/environments/*`   |

Privilégier les alias dès qu'on sort du dossier courant. Pas de `../../../../`.

## Stack technique

- Angular 21.2, standalone, zoneless (`provideZonelessChangeDetection`).
- SSR + hydration (`provideClientHydration(withEventReplay())`, `withFetch()`).
- Routing : lazy uniquement (`loadComponent`), `withComponentInputBinding()`, `withViewTransitions()`.
- Vitest via `@angular/build:unit-test` (`runner: vitest`, env jsdom).
- Tailwind v4 (`src/tailwind.css`).
- ESLint (`@angular-eslint`) + Prettier + `prettier-plugin-tailwindcss`.
- Husky + lint-staged + commitlint (conventional-commits).
- CI GitHub Actions, release-please.

## TypeScript

- `strict: true`. `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `strictTemplates`.
- **Jamais `any`**. Utiliser `unknown` aux frontières puis narrow.
- `readonly` sur tout ce qui ne doit pas muter.
- Interfaces > types pour les objets (règle ESLint `consistent-type-definitions: interface`).
- Préférer l'inférence quand le type est évident.

## Composants

- **Standalone par défaut** — ne JAMAIS écrire `standalone: true` (défaut depuis v20).
- **Toujours** `changeDetection: ChangeDetectionStrategy.OnPush`.
- `input()` / `output()` / `model()` — pas de `@Input` / `@Output`.
- `inject()` partout, pas de constructeur DI.
- Pas de `@HostBinding` / `@HostListener` — utiliser `host: {}`.
- Templates inline pour les petits composants ; externes au-delà de ~40 lignes.
- Préfixe sélecteur : `app-` (kebab-case pour composants, camelCase pour directives).
- Suffixes obligatoires : `View`, `ViewModel`, `Service`, `Repository`, `Component` (UI partagé).
- Fichiers en kebab-case : `counter.view.ts`, `counter.viewmodel.ts`, `user.repository.ts`.

## Signals (règle stricte)

- **Une seule source de vérité** par état : un `signal`.
- État dérivé = `computed()`. **Jamais** de recalcul manuel.
- Signal privé `_camelCase` exposé via `asReadonly()` ou `computed()`.
- `linkedSignal()` quand l'état doit se réinitialiser depuis une source.
- `resource()` / `rxResource()` pour les chargements async — préférer ça à `toSignal(http$)`.
- `effect()` UNIQUEMENT pour effets de bord (logging, localStorage, focus). Pas pour transformer un signal en autre signal.
- Pas de `.mutate()` — utiliser `.set()` ou `.update()`.
- **Pas d'`Observable` exposé au template** — convertir via `toSignal()` à la frontière.
- **Pas de `BehaviorSubject` pour gérer un état** — utiliser `signal()`.

## Templates

- Control flow natif : `@if`, `@for`, `@switch`, `@let`. JAMAIS `*ngIf` / `*ngFor`.
- `@for` doit avoir un `track` explicite.
- `@defer` pour les sections lourdes (`on viewport`, `on idle`, `on interaction`).
- Pas de `ngClass` / `ngStyle` → `[class.x]` / `[style.x]`.
- Pas de logique complexe — déplacer dans un `computed()`.
- A11y : `aria-*`, focus visible, WCAG AA, AXE clean. Le lint template `templateAccessibility` est actif.

## Services

- Singletons : `@Injectable({ providedIn: 'root' })` dans `core/services/`.
- ViewModels : `@Injectable()` **sans** `providedIn`, fournis via `providers: [...]` sur le composant.
- Une responsabilité par service.
- `inject()` toujours, jamais le constructeur.

## HTTP

- `provideHttpClient(withFetch())` (compatible SSR/Edge).
- Interceptors en **fonctions** (`HttpInterceptorFn`) — voir `@core/interceptors/error.interceptor.ts`.
- Repositories dans `data/repositories/` retournent `Promise` (via `firstValueFrom`) ou `Observable`. Jamais de state mutable.
- Erreurs centralisées dans `errorInterceptor` + `GlobalErrorHandler` (`@core/services/global-error-handler.ts`).

## Routing

- 100% lazy : `loadComponent: () => import('@features/x/view/x.view').then(m => m.XView)`.
- Guards et resolvers en **fonctions** (`CanActivateFn`, `ResolveFn`).
- `withComponentInputBinding()` ⇒ params de route exposés via `input()`.
- URLs en kebab-case minuscule.

## Environments

- `@env/environment` (dev) → remplacé par `environment.prod.ts` au build prod (`fileReplacements`).
- Consommer via le token `APP_ENV`, pas par import direct dans les composants/ViewModels :
  ```ts
  const env = inject(APP_ENV);
  ```
- Ne JAMAIS importer `environment.ts` directement depuis un composant ou ViewModel (testabilité).

## Tests (Vitest)

- Globals activés (`describe`, `it`, `expect`, `beforeEach` via `vitest`).
- Cible prioritaire : **ViewModels** (logique pure sur signals).
- View : tests de bindings et d'interactions clavier seulement.
- Pas de mocks à outrance — préférer des fakes typés.
- Une feature sans test de ViewModel ne se merge pas.
- Fichier : `<source>.spec.ts` à côté du source.

## Commits (conventional-commits, verrouillés)

Format :
```
<type>(<scope>?): <sujet>
```

Types autorisés : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Règles :
- Sujet en **minuscule**, impératif présent, pas de point final, ≤ 100 caractères.
- `feat` ⇒ bump minor automatique (release-please).
- `fix` ⇒ bump patch automatique.
- `BREAKING CHANGE:` dans le footer ⇒ bump major.

## Commandes à lancer

Avant tout commit ou PR :
```bash
npm run lint
npm test
npm run build
```

`npm run format` si nécessaire. Le pre-commit hook (lint-staged) le fait sur les fichiers stagés.

## Pièges à éviter

- ❌ `BehaviorSubject` pour gérer un état → ✅ `signal()`.
- ❌ `toSignal(http.get(...))` → ✅ `resource()` / `rxResource()`.
- ❌ Logique métier dans la View → ✅ ViewModel.
- ❌ ViewModel `providedIn: 'root'` (sauf si vraiment global → c'est alors un service de `core/`).
- ❌ Import relatif profond (`../../../../core`) → ✅ alias `@core/...`.
- ❌ `import { environment } from '../../environments/environment'` dans un composant → ✅ `inject(APP_ENV)`.
- ❌ `*ngIf` / `*ngFor` → ✅ `@if` / `@for` avec `track`.
- ❌ `any` → ✅ `unknown` + narrow.
- ❌ `@HostBinding` / `@HostListener` → ✅ `host: {}`.
- ❌ `ngClass` / `ngStyle` → ✅ `[class.x]` / `[style.x]`.
- ❌ Skip hooks avec `--no-verify` — corriger plutôt que bypass.
