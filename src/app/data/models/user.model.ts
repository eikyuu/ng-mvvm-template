/**
 * Modèles de domaine — formes immuables décrivant les entités retournées par l'API.
 * Les modèles ne contiennent AUCUNE logique. Le mapping DTO brut ⇄ domaine se fait dans `data/http/`.
 */

export type UserId = string & { readonly __brand: 'UserId' };

export interface User {
  readonly id: UserId;
  readonly email: string;
  readonly displayName: string;
  readonly createdAt: Date;
}
