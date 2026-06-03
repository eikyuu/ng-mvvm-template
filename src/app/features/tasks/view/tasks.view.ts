import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TaskStatus } from '@data/models/task.model';

import { TASK_STATUS_LABELS, TASK_STATUSES } from '../model/task-form.model';
import { StatusFilter, TasksViewModel } from '../viewmodel/tasks.viewmodel';
import { TaskFormComponent } from './task-form.component';
import { TaskListComponent } from './task-list.component';

@Component({
  selector: 'app-tasks-view',
  imports: [TaskListComponent, TaskFormComponent],
  providers: [TasksViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto flex max-w-3xl flex-col gap-6">
      <header class="flex items-baseline justify-between">
        <h1 class="text-2xl font-semibold">Tâches</h1>
        @if (vm.loading()) {
          <span class="text-sm text-zinc-500">Chargement…</span>
        }
      </header>

      <app-task-form
        [form]="vm.form"
        [isEditing]="vm.isEditing()"
        [disabled]="vm.loading()"
        (formCancel)="vm.cancel()"
      />

      <div class="flex flex-col gap-3">
        <div class="flex gap-2">
          <label class="flex flex-1 flex-col gap-1">
            <span class="text-sm">Recherche</span>
            <input
              type="search"
              placeholder="Filtrer par titre…"
              class="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800"
              [value]="vm.search()"
              (input)="onSearch($event)"
            />
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-sm">Statut</span>
            <select
              class="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800"
              [value]="vm.filterStatus()"
              (change)="onFilter($event)"
            >
              <option value="all">Tous</option>
              @for (s of statuses; track s) {
                <option [value]="s">{{ statusLabel(s) }}</option>
              }
            </select>
          </label>
        </div>

        <app-task-list
          [tasks]="vm.filteredTasks()"
          [editingId]="vm.editingId()"
          (edit)="vm.startEdit($event)"
          (delete)="vm.remove($event)"
        />
      </div>
    </section>
  `,
})
export class TasksView {
  protected readonly vm = inject(TasksViewModel);
  protected readonly statuses = TASK_STATUSES;

  protected statusLabel(s: TaskStatus): string {
    return TASK_STATUS_LABELS[s];
  }

  protected onSearch(event: Event): void {
    this.vm.setSearch((event.target as HTMLInputElement).value);
  }

  protected onFilter(event: Event): void {
    this.vm.setFilter((event.target as HTMLSelectElement).value as StatusFilter);
  }
}
