---
paths:
  - 'src/app/**/*.viewmodel.ts'
---

# Règles ViewModel + signals

Le **ViewModel** possède l'état. Pas de DOM, pas de HTTP direct.

## Injection

- `@Injectable()` **sans** `providedIn` — fourni via `providers: [XxxViewModel]` sur le composant (scoped).
- `inject()` toujours, jamais le constructeur.
- État : signaux privés `_camelCase`, exposés via `asReadonly()` ou `computed()`.

## Signals (règle stricte)

- **Une seule source de vérité** par état : un `signal`.
- État dérivé = `computed()`. **Jamais** de recalcul manuel.
- `linkedSignal()` quand l'état doit se réinitialiser depuis une source.
- `resource()` / `rxResource()` / `httpResource()` pour les chargements async — préférer ça à `toSignal(http$)`.
- `effect()` UNIQUEMENT pour effets de bord (logging, localStorage, focus).
  Pas pour transformer un signal en un autre signal.
- Pas de `.mutate()` — utiliser `.set()` ou `.update()`.
- **Pas d'`Observable` exposé au template** — convertir via `toSignal()` à la frontière.
- **Pas de `BehaviorSubject` pour gérer un état** — utiliser `signal()`.

## Pièges

- ❌ `BehaviorSubject` pour gérer un état → ✅ `signal()`.
- ❌ `toSignal(http.get(...))` → ✅ `resource()` / `rxResource()`.
- ❌ ViewModel `providedIn: 'root'` (sauf si vraiment global → c'est alors un service de `core/`).
