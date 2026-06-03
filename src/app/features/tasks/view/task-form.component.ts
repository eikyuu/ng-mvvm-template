import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FieldTree, FormField, FormRoot } from '@angular/forms/signals';

import { TaskStatus } from '@data/models/task.model';

import { TASK_STATUS_LABELS, TASK_STATUSES, TaskFormState } from '../model/task-form.model';

@Component({
  selector: 'app-task-form',
  imports: [FormRoot, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let tree = form();
    @let root = tree();
    <form
      [formRoot]="tree"
      class="flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
    >
      <h2 class="text-lg font-semibold">
        {{ isEditing() ? 'Modifier la tâche' : 'Nouvelle tâche' }}
      </h2>

      <label class="flex flex-col gap-1">
        <span class="text-sm">Titre *</span>
        <input
          type="text"
          class="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-900"
          [formField]="tree.title"
          [attr.aria-invalid]="tree.title().invalid()"
          aria-describedby="title-error"
        />
        @if (firstMessage(tree.title().errors()); as msg) {
          <p id="title-error" class="text-sm text-red-600 dark:text-red-400">{{ msg }}</p>
        }
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-sm">Description</span>
        <textarea
          rows="2"
          class="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-900"
          [formField]="tree.description"
        ></textarea>
      </label>

      <div class="flex gap-3">
        <label class="flex flex-1 flex-col gap-1">
          <span class="text-sm">Statut</span>
          <select
            class="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-900"
            [formField]="tree.status"
          >
            @for (s of statuses; track s) {
              <option [value]="s">{{ statusLabel(s) }}</option>
            }
          </select>
        </label>

        <label class="flex flex-1 flex-col gap-1">
          <span class="text-sm">Échéance</span>
          <input
            type="date"
            class="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-900"
            [formField]="tree.dueDate"
            [attr.aria-invalid]="tree.dueDate().invalid()"
            aria-describedby="due-error"
          />
          @if (firstMessage(tree.dueDate().errors()); as msg) {
            <p id="due-error" class="text-sm text-red-600 dark:text-red-400">{{ msg }}</p>
          }
        </label>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        @if (isEditing()) {
          <button
            type="button"
            class="rounded-md bg-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            (click)="formCancel.emit()"
          >
            Annuler
          </button>
        }
        <button
          type="submit"
          class="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          [disabled]="root.invalid() || disabled()"
        >
          {{ isEditing() ? 'Enregistrer' : 'Créer' }}
        </button>
      </div>
    </form>
  `,
})
export class TaskFormComponent {
  readonly form = input.required<FieldTree<TaskFormState>>();
  readonly isEditing = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly formCancel = output<void>();

  protected readonly statuses = TASK_STATUSES;

  protected statusLabel(status: TaskStatus): string {
    return TASK_STATUS_LABELS[status];
  }

  protected firstMessage(errors: readonly { readonly message?: string }[]): string | null {
    return errors.find((e) => e.message)?.message ?? null;
  }
}
