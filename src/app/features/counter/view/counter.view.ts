import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CounterViewModel } from '../viewmodel/counter.viewmodel';

@Component({
  selector: 'app-counter-view',
  providers: [CounterViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto flex max-w-md flex-col gap-6 p-8">
      <header class="flex items-baseline justify-between">
        <h1 class="text-2xl font-semibold">Counter</h1>
        <span class="text-sm opacity-70">parité : {{ vm.parity() }}</span>
      </header>

      <p
        class="text-center text-6xl font-bold tabular-nums"
        [class.text-emerald-500]="vm.isPositive()"
        [class.text-zinc-500]="vm.isZero()"
        aria-live="polite"
      >
        {{ vm.value() }}
      </p>

      <div class="flex justify-center gap-2">
        <button
          type="button"
          class="rounded-md bg-zinc-200 px-4 py-2 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          (click)="vm.decrement()"
        >
          −
        </button>
        <button
          type="button"
          class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          (click)="vm.increment()"
        >
          +
        </button>
        <button
          type="button"
          class="rounded-md bg-zinc-200 px-4 py-2 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          (click)="vm.reset()"
        >
          reset
        </button>
      </div>

      <label class="flex items-center justify-between gap-3">
        <span class="text-sm">Pas</span>
        <input
          type="number"
          min="1"
          [value]="vm.step()"
          (input)="onStepChange($event)"
          class="w-24 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </label>
    </section>
  `,
})
export class CounterView {
  protected readonly vm = inject(CounterViewModel);

  protected onStepChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (!Number.isNaN(value)) {
      this.vm.setStep(value);
    }
  }
}
