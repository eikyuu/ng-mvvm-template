---
paths:
  - 'src/app/{core,data}/**/*.ts'
---

# Règles services / HTTP / data

Concerne `src/app/core/**` (singletons, interceptors) et `src/app/data/**` (repositories).

## Services

- Singletons : `@Injectable({ providedIn: 'root' })` dans `core/services/`.
- Une responsabilité par service.
- `inject()` toujours, jamais le constructeur.
- (Les ViewModels, eux, sont `@Injectable()` sans `providedIn` — voir `viewmodels.md`.)

## HTTP

- `httpResource()` pour exposer un GET directement en signal réactif depuis un ViewModel.
- Interceptors en **fonctions** (`HttpInterceptorFn`) — voir `@core/interceptors/error.interceptor.ts`.
- Repositories dans `data/repositories/` retournent `Promise` (via `firstValueFrom`) ou `Observable`.
  Jamais de state mutable.
- Erreurs centralisées dans `errorInterceptor` + `GlobalErrorHandler`
  (`@core/services/global-error-handler.ts`).
