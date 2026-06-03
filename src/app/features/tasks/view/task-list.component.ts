import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Task, TaskId } from '@data/models/task.model';

import { TASK_STATUS_LABELS } from '../model/task-form.model';

@Component({
  selector: 'app-task-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tasks().length === 0) {
      <p class="text-sm text-zinc-500 dark:text-zinc-400">Aucune tâche à afficher.</p>
    } @else {
      <ul role="list" class="flex flex-col gap-2">
        @for (task of tasks(); track task.id) {
          <li
            class="flex items-start justify-between gap-3 rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
            [class.ring-2]="task.id === editingId()"
            [class.ring-blue-500]="task.id === editingId()"
          >
            <div class="flex min-w-0 flex-col">
              <div class="flex items-center gap-2">
                <span class="truncate font-medium">{{ task.title }}</span>
                <span
                  class="rounded px-2 py-0.5 text-xs"
                  [class.bg-zinc-200]="task.status === 'todo'"
                  [class.bg-amber-200]="task.status === 'in-progress'"
                  [class.bg-emerald-200]="task.status === 'done'"
                  [class.dark:bg-zinc-700]="task.status === 'todo'"
                  [class.dark:bg-amber-700]="task.status === 'in-progress'"
                  [class.dark:bg-emerald-700]="task.status === 'done'"
                >
                  {{ statusLabel(task.status) }}
                </span>
              </div>
              @if (task.description) {
                <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{{ task.description }}</p>
              }
              @if (task.dueDate) {
                <p class="mt-1 text-xs text-zinc-500">Échéance : {{ formatDate(task.dueDate) }}</p>
              }
            </div>
            <div class="flex shrink-0 gap-1">
              <button
                type="button"
                class="rounded-md px-2 py-1 text-sm hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:hover:bg-zinc-700"
                [attr.aria-label]="'Modifier ' + task.title"
                (click)="edit.emit(task.id)"
              >
                Éditer
              </button>
              <button
                type="button"
                class="rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none dark:text-red-400 dark:hover:bg-red-950"
                [attr.aria-label]="'Supprimer ' + task.title"
                (click)="delete.emit(task.id)"
              >
                Supprimer
              </button>
            </div>
          </li>
        }
      </ul>
    }
  `,
})
export class TaskListComponent {
  readonly tasks = input.required<readonly Task[]>();
  readonly editingId = input<TaskId | null>(null);
  readonly edit = output<TaskId>();
  readonly delete = output<TaskId>();

  protected statusLabel(status: Task['status']): string {
    return TASK_STATUS_LABELS[status];
  }

  protected formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
}
