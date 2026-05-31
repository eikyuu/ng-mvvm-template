# Contributing

Merci pour ta contribution ! Quelques règles pour garder le template cohérent.

## Prérequis

- Node ≥ 22.12 (voir `.nvmrc`)
- npm ≥ 10.9

```bash
nvm use            # active la version Node du projet
npm install        # installe deps + hooks husky
```

## Workflow

1. Fork + branche depuis `main` : `git checkout -b feat/ma-feature`.
2. Code en respectant `docs/CONVENTIONS.md` et `docs/BEST-PRACTICES.md`.
3. Lance localement :
   ```bash
   npm run lint
   npm test
   npm run build
   ```
4. Commit en **conventional-commits** (vérifié par commitlint) :
   ```
   feat(counter): ajoute le bouton reset
   fix(auth): corrige la redirection
   docs: met à jour le README
   ```
5. Push + ouvre une PR.

## Pre-commit

`lint-staged` formate et lint **uniquement** les fichiers stagés. Pas besoin de lancer prettier sur tout le repo.

Si un hook échoue : corrige plutôt que de bypass (`--no-verify` est proscrit).

## Architecture

Toute nouvelle feature respecte la triade MVVM :

```
src/app/features/<feature>/
├── model/        # interfaces, types, constantes
├── viewmodel/    # @Injectable() — signals + intents
└── view/         # composant Angular, OnPush
```

Voir [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Signals uniquement

- Pas d'`Observable` exposé au template — convertir via `toSignal()`.
- Pas de `BehaviorSubject` pour gérer un état — utiliser `signal()`.
- État dérivé = `computed()`, jamais de recalcul manuel.

## Tests

- Vitest : `npm test`.
- Une feature sans test de ViewModel est refusée.
- Test de View autorisé mais facultatif (bindings et a11y).

## Documentation

Toute modification d'architecture, convention ou règle de lint doit mettre à jour le `docs/` correspondant **dans la même PR**.
