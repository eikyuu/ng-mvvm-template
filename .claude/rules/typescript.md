---
paths:
  - 'src/**/*.ts'
---

# Règles TypeScript

- `strict: true`. `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `strictTemplates`.
- **Jamais `any`**. Utiliser `unknown` aux frontières puis narrow.
- `readonly` sur tout ce qui ne doit pas muter.
- Interfaces > types pour les objets (règle ESLint `consistent-type-definitions: interface`).
- Préférer l'inférence quand le type est évident.
- TypeScript 6.0 (`~6.0.x`) requis par Angular 22 — éviter les API TS dépréciées en v6.
- Diagnostics templates `nullishCoalescingNotNullable` et `optionalChainNotNullable` mis en `suppress`
  (`tsconfig.app.json` / `tsconfig.spec.json`) — ne pas les réactiver sans raison.
- `baseUrl` conservé (requis par le bundler pour résoudre les alias `@core/*`…)
  - `ignoreDeprecations: "6.0"` pour silencer la dépréciation TS6 jusqu'à TS7.

## Piège

- ❌ `any` → ✅ `unknown` + narrow.
