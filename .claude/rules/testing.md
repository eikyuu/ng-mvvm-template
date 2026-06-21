---
paths:
  - '**/*.spec.ts'
---

# Règles tests (Vitest)

- Globals activés (`describe`, `it`, `expect`, `beforeEach` via `vitest`).
- Cible prioritaire : **ViewModels** (logique pure sur signals).
- View : tests de bindings et d'interactions clavier seulement.
- Pas de mocks à outrance — préférer des fakes typés.
- Une feature sans test de ViewModel ne se merge pas.
- Fichier : `<source>.spec.ts` à côté du source.
