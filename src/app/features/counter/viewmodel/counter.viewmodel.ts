import { Injectable, computed, signal } from '@angular/core';

import { INITIAL_COUNTER_STATE } from '../model/counter.model';

/**
 * CounterViewModel — expose l'état de présentation sous forme de signals et de méthodes d'intention.
 * Logique de présentation pure. Pas de DOM, pas de HTTP. Injecter les repositories ici si besoin.
 */
@Injectable()
export class CounterViewModel {
  private readonly _value = signal(INITIAL_COUNTER_STATE.value);
  private readonly _step = signal(INITIAL_COUNTER_STATE.step);

  readonly value = this._value.asReadonly();
  readonly step = this._step.asReadonly();
  readonly isZero = computed(() => this._value() === 0);
  readonly isPositive = computed(() => this._value() > 0);
  readonly parity = computed(() => (this._value() % 2 === 0 ? 'pair' : 'impair'));

  increment(): void {
    this._value.update((v) => v + this._step());
  }

  decrement(): void {
    this._value.update((v) => v - this._step());
  }

  reset(): void {
    this._value.set(INITIAL_COUNTER_STATE.value);
  }

  setStep(step: number): void {
    this._step.set(Math.max(1, Math.trunc(step)));
  }
}
