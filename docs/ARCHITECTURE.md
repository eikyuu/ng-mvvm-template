# Architecture

Template Angular 22+ basé sur l'architecture **MVVM** (Model-View-ViewModel), 100% **signals**, **standalone**, **zoneless**, **SSR-ready**.

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                         View                            │
│  (Composant Angular — template + bindings UI)          │
│  Responsabilité : afficher l'état, déclencher l'intent │
└────────────────────────┬────────────────────────────────┘
                         │ inject()
                         ▼
┌─────────────────────────────────────────────────────────┐
│                     ViewModel                           │
│  (Service @Injectable scoped au composant)             │
│  Responsabilité : signals de présentation, logique UI  │
│  Pas de DOM, pas de HTTP direct.                       │
└────────────────────────┬────────────────────────────────┘
                         │ inject()
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Repository / Data Service                  │
│  Responsabilité : accès HTTP, persistance, cache       │
│  Retourne des Promises ou des Observables, jamais      │
│  d'état mutable. Le ViewModel les convertit en signal. │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                       Model                             │
│  (interfaces TypeScript — domaine immutable)           │
│  Pas de logique, juste la forme des données.           │
└─────────────────────────────────────────────────────────┘
```

## Arborescence

```
src/app/
├── core/                  # Singletons applicatifs (providedIn: 'root')
│   ├── config/            # InjectionToken, environment
│   ├── guards/            # CanActivate / CanMatch
│   ├── interceptors/      # HttpInterceptorFn
│   ├── services/          # Logger, Auth, Theme, ...
│   └── tokens/            # InjectionToken globaux
│
├── shared/                # Réutilisable, pur, sans dépendance métier
│   ├── components/        # UI building blocks (Button, Card, Modal)
│   ├── directives/
│   ├── pipes/
│   └── utils/             # Fonctions pures
│
├── data/                  # Couche d'accès aux données
│   ├── models/            # Interfaces DTO et domaine
│   ├── repositories/      # Classes encapsulant l'accès HTTP
│   └── http/              # HttpClient wrappers, mappers
│
├── features/              # Une feature = un dossier auto-contenu
│   └── <feature>/
│       ├── model/         # Types & state shape de la feature
│       ├── viewmodel/     # Logique de présentation (signals)
│       ├── view/          # Composant Angular
│       └── index.ts       # Barrel public
│
├── layouts/               # Layouts d'application (header/footer/nav)
│   └── main-layout/       # layout principal — chrome de l'app
│
├── app.config.ts          # Providers root
├── app.routes.ts          # Routes lazy-loaded
└── app.ts                 # Shell racine
```

## MVVM en pratique

### Model

Interfaces immutables (`readonly`). Aucune logique. Représente le **domaine**.

```ts
// features/counter/model/counter.model.ts
export interface CounterState {
  readonly value: number;
  readonly step: number;
}
```

### ViewModel

- Service `@Injectable()` (sans `providedIn: 'root'`) — **scoped au composant**.
- Expose l'état **uniquement** via signals (`signal`, `computed`, `linkedSignal`, `resource`, `httpResource`).
- Méthodes publiques = **intents** (verbes : `increment`, `loadUser`, `submit`).
- Aucun accès direct au DOM. Injecte les repositories.

```ts
@Injectable()
export class CounterViewModel {
  private readonly _value = signal(0);
  readonly value = this._value.asReadonly();
  readonly isZero = computed(() => this._value() === 0);

  increment(): void {
    this._value.update((v) => v + 1);
  }
}
```

### View

- Composant standalone, `ChangeDetectionStrategy.OnPush`.
- Injecte le ViewModel via `providers: [XxxViewModel]` puis `inject(XxxViewModel)`.
- Le template lit les signals (`vm.value()`) et appelle les intents (`vm.increment()`).
- **Aucune logique métier** dans la View — uniquement présentation et délégation.

```ts
@Component({
  providers: [CounterViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button (click)="vm.increment()">{{ vm.value() }}</button>`,
})
export class CounterView {
  protected readonly vm = inject(CounterViewModel);
}
```

## Pourquoi le ViewModel est scoped au composant ?

Un ViewModel global devient un store partagé — c'est un autre pattern.
Scope au composant ⇒ état isolé, testable, jetable, et plusieurs instances coexistent sans collision.
Pour un état global, créez un **service `providedIn: 'root'`** dans `core/services/`.

## Communication

| Direction       | Mécanisme                                          |
| --------------- | -------------------------------------------------- |
| Parent → enfant | `input()` (signal input)                           |
| Enfant → parent | `output()`                                         |
| Frères          | Service partagé via injection                      |
| Cross-feature   | Service `providedIn: 'root'` dans `core/services/` |
| HTTP            | Repository injecté dans le ViewModel               |
| Effet de bord   | `effect()` dans le ViewModel (avec `cleanup`)      |

## Routing

- 100% **lazy loading** via `loadComponent`.
- Pas de `NgModule`.
- `withComponentInputBinding()` — les `:params` de route sont bindés via `input()`.
- `withViewTransitions()` — transitions natives navigateur.

### Layouts

Un **layout** est un composant qui enveloppe ses routes enfants via `<router-outlet />` et fournit le chrome (header, nav, footer, sidebars).

Pattern utilisé : route parente qui charge le layout, routes enfants déclarées en `children`.

```ts
{
  path: '',
  loadComponent: () => import('@layouts/main-layout/main-layout.component')
    .then(m => m.MainLayoutComponent),
  children: [
    { path: 'counter', loadComponent: () => import('@features/counter/view/counter.view').then(m => m.CounterView) },
    { path: 'about',   loadComponent: () => import('@features/about/view/about.view').then(m => m.AboutView) },
  ],
}
```

Plusieurs layouts coexistent (ex: `MainLayoutComponent` pour les pages connectées, `AuthLayoutComponent` pour login/register). Chacun expose son propre `<router-outlet />`.

Un layout n'a **pas de ViewModel** — c'est de la présentation pure. S'il a besoin d'état, c'est un service `core/` partagé (theme, user courant, etc.).

## Rendu

- **Zoneless** (`provideZonelessChangeDetection`).
- **SSR + hydration** activés (`provideClientHydration(withEventReplay(), withNoIncrementalHydration())`).
- `withFetch()` pour un HttpClient compatible Edge / Node.

## Tests

- **Vitest** via le builder `@angular/build:unit-test`.
- `jsdom` comme environnement.
- Tester en priorité le **ViewModel** (logique pure, signals).
- Tester la View uniquement pour les bindings et les interactions.

## Exemples par dossier

Chaque dossier contient un exemple minimal **canonique** — pas un exemple jetable. Reprends-les comme gabarit pour tes propres ajouts.

### `core/`

| Dossier         | Exemple                   | Rôle                                                  |
| --------------- | ------------------------- | ----------------------------------------------------- |
| `config/`       | `app.config.token.ts`     | `InjectionToken<AppEnvironment>` global               |
| `guards/`       | `auth.guard.ts`           | `CanActivateFn` — guard fonctionnel                   |
| `interceptors/` | `error.interceptor.ts`    | `HttpInterceptorFn` — log centralisé des erreurs HTTP |
| `services/`     | `logger.service.ts`       | Singleton `providedIn: 'root'`                        |
| `services/`     | `global-error-handler.ts` | `ErrorHandler` global — point d'attache Sentry        |
| `tokens/`       | `window.token.ts`         | Token SSR-safe pour `window`                          |

### `shared/`

| Dossier       | Exemple                            | Rôle                                               |
| ------------- | ---------------------------------- | -------------------------------------------------- |
| `components/` | `not-found/not-found.component.ts` | Composant UI standalone, OnPush                    |
| `directives/` | `autofocus.directive.ts`           | Directive avec `input()` et `afterNextRender`      |
| `pipes/`      | `truncate.pipe.ts` (+ `.spec.ts`)  | Pipe pur testé avec Vitest                         |
| `utils/`      | `assert.util.ts`                   | Fonctions pures (`assertNonNullable`, `typedKeys`) |

### `data/`

| Dossier         | Exemple              | Rôle                                                     |
| --------------- | -------------------- | -------------------------------------------------------- |
| `models/`       | `user.model.ts`      | Interface domaine `readonly` + branded type `UserId`     |
| `http/`         | `user.dto.ts`        | DTO brut API + mapper `mapUserDto` vers le domaine       |
| `repositories/` | `user.repository.ts` | Seul endroit qui touche `HttpClient`, renvoie du domaine |

### `features/`

| Dossier              | Exemple                         | Rôle                               |
| -------------------- | ------------------------------- | ---------------------------------- |
| `counter/model/`     | `counter.model.ts`              | `CounterState` immutable + initial |
| `counter/viewmodel/` | `counter.viewmodel.ts` (+ spec) | Signals privés, intents, computed  |
| `counter/view/`      | `counter.view.ts`               | View OnPush, lit `vm.xxx()`        |
| `about/view/`        | `about.view.ts`                 | Feature sans état (page statique)  |

### `layouts/`

| Dossier        | Exemple                    | Rôle                                             |
| -------------- | -------------------------- | ------------------------------------------------ |
| `main-layout/` | `main-layout.component.ts` | Chrome (header/nav/footer) + `<router-outlet />` |

### Règles de lecture

- Un dossier **vide** = pas de cas représentatif. Ne pas créer de fichier placeholder.
- Un nouvel exemple par dossier doit respecter les conventions de nommage de `CONVENTIONS.md`.
- Si un exemple n'a pas de test, c'est qu'il n'a pas de logique testable (interface, layout sans état, token). Sinon il doit en avoir un.

Voir `BEST-PRACTICES.md` et `CONVENTIONS.md`.
