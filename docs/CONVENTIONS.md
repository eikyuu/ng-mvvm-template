# Conventions de nommage

## Fichiers

| Élément                | Pattern                              | Exemple                         |
|------------------------|--------------------------------------|---------------------------------|
| Composant View         | `<feature>.view.ts`                  | `counter.view.ts`               |
| ViewModel              | `<feature>.viewmodel.ts`             | `counter.viewmodel.ts`          |
| Model                  | `<feature>.model.ts`                 | `counter.model.ts`              |
| Service                | `<nom>.service.ts`                   | `logger.service.ts`             |
| Repository             | `<entity>.repository.ts`             | `user.repository.ts`            |
| Composant UI partagé   | `<nom>.component.ts`                 | `button.component.ts`           |
| Directive              | `<nom>.directive.ts`                 | `autofocus.directive.ts`        |
| Pipe                   | `<nom>.pipe.ts`                      | `currency-format.pipe.ts`       |
| Guard                  | `<nom>.guard.ts`                     | `auth.guard.ts`                 |
| Interceptor            | `<nom>.interceptor.ts`               | `error.interceptor.ts`          |
| Resolver               | `<nom>.resolver.ts`                  | `user.resolver.ts`              |
| InjectionToken         | `<nom>.token.ts`                     | `app.config.token.ts`           |
| Test                   | `<source>.spec.ts`                   | `counter.viewmodel.spec.ts`     |

**Toujours en kebab-case** pour les noms de fichiers.

## Classes / symboles TypeScript

| Élément                   | Convention       | Exemple                       |
|---------------------------|------------------|-------------------------------|
| Classe (composant, service) | `PascalCase`   | `CounterViewModel`            |
| Suffixe View              | `View`           | `CounterView`                 |
| Suffixe ViewModel         | `ViewModel`      | `CounterViewModel`            |
| Suffixe Service           | `Service`        | `LoggerService`               |
| Suffixe Repository        | `Repository`     | `UserRepository`              |
| Suffixe Component partagé | `Component`      | `ButtonComponent`             |
| Interface                 | `PascalCase`     | `CounterState` (pas `ICounterState`) |
| Type alias                | `PascalCase`     | `UserId`                      |
| Enum                      | `PascalCase`     | `OrderStatus`                 |
| Constante                 | `SCREAMING_SNAKE`| `INITIAL_COUNTER_STATE`       |
| Variable / fonction       | `camelCase`      | `loadUser()`                  |
| InjectionToken            | `SCREAMING_SNAKE`| `APP_ENV`                     |
| Signal privé              | `_camelCase`     | `_value`                      |
| Signal public             | `camelCase`      | `value`                       |

## Selectors Angular

- Préfixe `app-` (configuré dans `angular.json`).
- kebab-case : `app-counter-view`, `app-not-found`.

## Routes

- URLs en kebab-case minuscule : `/user-profile`, pas `/userProfile`.
- Pas de trailing slash.

## Signals

- Signal d'état **interne** : `_camelCase` privé.
- Exposition publique : version `asReadonly()` ou `computed()`.
- Pas de signal `mutable` exposé en lecture-écriture vers le template.

```ts
private readonly _user = signal<User | null>(null);
readonly user = this._user.asReadonly();
readonly isLoggedIn = computed(() => this._user() !== null);
```

## Intents (méthodes de ViewModel)

- Verbe à l'impératif : `increment`, `submit`, `loadUsers`.
- Pas de getter qui déclenche une action.
- Retour `void` par défaut ; `Promise<void>` si async.

## Imports

Ordre (séparé par une ligne vide) :
1. Angular core / packages tiers
2. Imports `@app/core`, `@app/shared`, `@app/data`
3. Imports relatifs (`./`, `../`)

```ts
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LoggerService } from '../../core/services/logger.service';

import { CounterViewModel } from '../viewmodel/counter.viewmodel';
```

## Commits (conventional-commits)

Format imposé par `commitlint` :

```
<type>(<scope>?): <sujet>

[body optionnel]

[footer optionnel]
```

Types autorisés : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Exemples :
- `feat(counter): ajoute un bouton reset`
- `fix(auth): corrige redirection après login`
- `refactor(shared): extrait Button en composant standalone`
- `docs: met à jour ARCHITECTURE.md`

Règles :
- Sujet en **minuscule**, à l'impératif présent.
- Pas de point final.
- Header ≤ 100 caractères.
