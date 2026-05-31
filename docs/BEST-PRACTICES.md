# Best practices Angular 2026

Cible : Angular 21+, zoneless, signals-first, standalone, SSR.

## TypeScript

- `strict: true` non négociable.
- Pas de `any`. Utiliser `unknown` aux frontières, puis narrow.
- Préférer l'inférence de type quand elle est évidente.
- `readonly` sur tout ce qui ne doit pas muter (props d'interface, propriétés de classe, tableaux exposés).
- Discriminated unions plutôt que enums numériques.

## Composants

- **Standalone uniquement**. Ne jamais écrire `standalone: true` (c'est le défaut depuis v20).
- **Toujours** `changeDetection: ChangeDetectionStrategy.OnPush`.
- `input()` / `output()` au lieu des décorateurs `@Input` / `@Output`.
- `model()` pour les two-way bindings.
- `inject()` plutôt que constructeur.
- Templates et styles **inline** pour les petits composants. Externes au-delà de ~40 lignes.
- Pas de `@HostBinding` / `@HostListener` — utiliser `host: {}` dans le décorateur.

## Signals (règle d'or)

- **Une seule source de vérité** par état : un `signal`.
- Tout état dérivé : `computed()`. Jamais de recalcul manuel.
- État local d'un composant : signal privé `_xxx`, exposé via `asReadonly()`.
- État partagé entre composants frères : signal dans un service injecté.
- État global applicatif : service `providedIn: 'root'`.
- `linkedSignal()` quand un signal doit se réinitialiser depuis une source.
- `resource()` / `rxResource()` pour les chargements async — préférer ça à `toSignal(http$)`.
- `effect()` réservé aux **effets de bord** (logging, localStorage, focus). Jamais pour transformer un signal en autre signal — c'est le rôle de `computed`.
- Pas de `mutate`. Utiliser `set` ou `update`.
- Pas d'`Observable` exposé au template — convertir via `toSignal()` à la frontière.

## Templates

- Control flow natif : `@if`, `@for`, `@switch`, `@let`. Jamais `*ngIf` / `*ngFor`.
- `@for` **doit** avoir un `track` explicite.
- `@defer` pour le code-splitting fin (sections lourdes, sous-le-fold).
- Pas de `ngClass` / `ngStyle` → utiliser `[class.x]` / `[style.x]`.
- Pas de logique complexe dans le template — déplacer dans un `computed`.
- Toujours `aria-*` et focus management. Cible : AXE clean, WCAG AA.

## State & MVVM

- View = présentation, ViewModel = logique de présentation, Repository = données.
- Le ViewModel **possède** son état. La View **lit** et **déclenche**.
- Pas d'`inject()` de HttpClient dans une View. Toujours via Repository → ViewModel.
- Tests prioritaires : ViewModel (logique pure sur signals).

## Services

- `providedIn: 'root'` par défaut pour les singletons.
- ViewModel : `@Injectable()` sans `providedIn`, fourni au composant via `providers: [...]`.
- `inject()` partout, jamais le constructeur.
- Une responsabilité par service.

## HTTP

- `provideHttpClient(withFetch())` — compatible SSR / Edge.
- Interceptors en **fonctions** (`HttpInterceptorFn`), pas en classes.
- Erreurs centralisées dans un interceptor.
- Repositories retournent des `Promise` (via `firstValueFrom`) ou des `Observable` — jamais du state mutable.

## Routing

- 100% lazy loading via `loadComponent` / `loadChildren`.
- Guards et resolvers en fonctions (`CanActivateFn`, `ResolveFn`).
- `withComponentInputBinding()` ⇒ les params de route sont des `input()` signals.
- Préfetch via `PreloadAllModules` ou stratégie custom selon le besoin.

## Performance

- Zoneless (`provideZonelessChangeDetection`).
- `NgOptimizedImage` pour toutes les images statiques (sauf base64 inline).
- `@defer` avec triggers (`on viewport`, `on idle`, `on interaction`).
- `track` correct dans `@for` — sinon recréation de DOM à chaque update.
- Budgets Angular configurés dans `angular.json` (déjà fait : 500kB warning / 1MB error).
- `provideExperimentalCheckNoChangesForDebug` en dev uniquement.

## SSR

- `provideClientHydration(withEventReplay())` activé.
- Pas de référence directe à `window` / `document` sans `isPlatformBrowser`.
- `afterNextRender` / `afterEveryRender` pour les effets navigateur uniquement.

## Tests (Vitest)

- Runner : `@angular/build:unit-test` + `vitest`.
- Environnement : `jsdom`.
- Globals (`describe`, `it`, `expect`) activés via `tsconfig.spec.json` (`types: ["vitest/globals"]`).
- Tester la **logique** dans le ViewModel — c'est là que les bugs sont prévisibles.
- Tester la View pour les **bindings** et les **interactions clavier**.
- Utiliser `TestBed` avec providers minimaux. Pas de mocks à outrance.
- Préférer des **fakes** typés à des mocks Jest-like.

## Accessibilité

- Tout composant interactif doit être atteignable au clavier.
- Labels associés (`<label for>` ou `aria-labelledby`).
- Contraste WCAG AA.
- `aria-live` pour les zones dynamiques (compteur, toasts).
- Focus visible — ne jamais retirer `outline` sans alternative.

## Style / CSS

- Tailwind v4 via `tailwind.css` importé dans `angular.json`.
- Classes utilitaires en priorité. SCSS pour les cas complexes ou les tokens.
- `:host { display: block }` quand pertinent pour les composants.

## DI et tokens

- Configuration injectable via `InjectionToken` typé (voir `core/config/app.config.token.ts`).
- Pas de `environment.ts` partagé — toujours via DI pour la testabilité.

## Linting & format

- Prettier en source de vérité de format. Husky `pre-commit` vérifie.
- ESLint (`@angular-eslint`) actif avec règles strictes : `prefer-on-push`, `prefer-standalone`, `prefer-signals`, `prefer-control-flow`, accessibilité des templates, pas de `any`. Lance `npm run lint` / `npm run lint:fix`.

## Commits

Voir `CONVENTIONS.md` — conventional-commits imposés par commitlint.
