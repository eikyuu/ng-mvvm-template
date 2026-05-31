import { User, UserId } from '@data/models/user.model';

/**
 * Forme brute retournée par l'API. Vit dans `data/http/`, ne fuite jamais
 * hors de la couche data — les repositories mappent DTO ⇄ domaine.
 */
export interface UserDto {
  readonly id: string;
  readonly email: string;
  readonly display_name: string;
  readonly created_at: string;
}

export function mapUserDto(dto: UserDto): User {
  return {
    id: dto.id as UserId,
    email: dto.email,
    displayName: dto.display_name,
    createdAt: new Date(dto.created_at),
  };
}
