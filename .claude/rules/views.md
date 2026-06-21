---
paths:
  - 'src/app/**/*.{view,component}.ts'
---

# Règles View / composants / templates

Concerne les fichiers `*.view.ts` et `*.component.ts` (templates inline inclus).
Une **View** lit les signals et délègue les intents — **aucune logique métier** (elle vit dans le ViewModel).

## Composant

- **Standalone par défaut** — ne JAMAIS écrire `standalone: true` (défaut depuis v20).
- **Toujours** `changeDetection: ChangeDetectionStrategy.OnPush`.
- `input()` / `output()` / `model()` — pas de `@Input` / `@Output`.
- `inject()` partout, pas de constructeur DI.
- Pas de `@HostBinding` / `@HostListener` — utiliser `host: {}`.
- Templates inline pour les petits composants ; externes au-delà de ~40 lignes.

## Templates

- Control flow natif : `@if`, `@for`, `@switch`, `@let`. JAMAIS `*ngIf` / `*ngFor`.
- `@for` doit avoir un `track` explicite.
- `@defer` pour les sections lourdes (`on viewport`, `on idle`, `on interaction`).
- Pas de `ngClass` / `ngStyle` → `[class.x]` / `[style.x]`.
- Pas de logique complexe dans le template — déplacer dans un `computed()`.
- A11y : `aria-*`, focus visible, WCAG AA, AXE clean. Le lint template `templateAccessibility` est actif.

## Pièges

- ❌ Logique métier dans la View → ✅ ViewModel.
- ❌ `*ngIf` / `*ngFor` → ✅ `@if` / `@for` avec `track`.
- ❌ `@HostBinding` / `@HostListener` → ✅ `host: {}`.
- ❌ `ngClass` / `ngStyle` → ✅ `[class.x]` / `[style.x]`.
