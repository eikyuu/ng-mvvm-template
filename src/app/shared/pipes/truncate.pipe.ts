import { Pipe, PipeTransform } from '@angular/core';

/**
 * Tronque une chaîne à `max` caractères et ajoute des points de suspension.
 *
 * @example
 * {{ user.bio | truncate:80 }}
 * {{ user.bio | truncate:80:'…' }}
 */
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, max = 100, suffix = '…'): string {
    if (!value) return '';
    return value.length <= max ? value : value.slice(0, max).trimEnd() + suffix;
  }
}
