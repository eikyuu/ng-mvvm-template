/**
 * Fonctions utilitaires pures. Pas d'Angular, pas de DOM, aucun effet de bord — juste des fonctions typées.
 */

/**
 * Restreint `value` à un type non-nullable. Lève une erreur si null/undefined.
 *
 * @example
 * const user = assertNonNullable(maybeUser, 'user must be loaded here');
 */
export function assertNonNullable<T>(
  value: T | null | undefined,
  message = 'Expected value to be defined',
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

/**
 * `Object.keys` typé.
 */
export function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}
