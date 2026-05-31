import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

import { APP_ENV } from '@core/config/app.config.token';
import { UserDto, mapUserDto } from '@data/http/user.dto';
import { User, UserId } from '@data/models/user.model';

/**
 * Les repositories sont la SEULE couche autorisée à manipuler HttpClient.
 * Ils retournent des Promises (ou des Observables) de modèles de domaine — jamais de DTO bruts.
 * Les ViewModels injectent les repositories ; les vues, jamais.
 */
@Injectable({ providedIn: 'root' })
export class UserRepository {
  private readonly http = inject(HttpClient);
  private readonly env = inject(APP_ENV);

  list(): Promise<User[]> {
    return firstValueFrom(
      this.http.get<UserDto[]>(`${this.env.apiBaseUrl}/users`).pipe(map((dtos) => dtos.map(mapUserDto))),
    );
  }

  getById(id: UserId): Promise<User> {
    return firstValueFrom(
      this.http.get<UserDto>(`${this.env.apiBaseUrl}/users/${id}`).pipe(map(mapUserDto)),
    );
  }
}
