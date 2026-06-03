import { Injectable, computed, inject, signal } from '@angular/core';
import { form, submit } from '@angular/forms/signals';

import { LoggerService } from '@core/services/logger.service';
import { Task, TaskId, TaskStatus } from '@data/models/task.model';
import { TaskRepository } from '@data/repositories/task.repository';

import {
  INITIAL_TASK_FORM,
  TaskFormState,
  buildTaskPayload,
  taskFormSchema,
  toIsoDate,
} from '../model/task-form.model';

export type StatusFilter = TaskStatus | 'all';

@Injectable()
export class TasksViewModel {
  private readonly repo = inject(TaskRepository);
  private readonly logger = inject(LoggerService);

  private readonly _tasks = signal<readonly Task[]>([]);
  private readonly _loading = signal(false);
  private readonly _editingId = signal<TaskId | null>(null);
  private readonly _formModel = signal<TaskFormState>({ ...INITIAL_TASK_FORM });
  private readonly _search = signal('');
  private readonly _filterStatus = signal<StatusFilter>('all');

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly editingId = this._editingId.asReadonly();
  readonly search = this._search.asReadonly();
  readonly filterStatus = this._filterStatus.asReadonly();
  readonly isEditing = computed(() => this._editingId() !== null);

  readonly form = form(this._formModel, taskFormSchema, {
    submission: { action: () => this.persist() },
  });

  readonly filteredTasks = computed<readonly Task[]>(() => {
    const query = this._search().trim().toLowerCase();
    const status = this._filterStatus();
    return this._tasks()
      .filter((t) => (status === 'all' ? true : t.status === status))
      .filter((t) => (query === '' ? true : t.title.toLowerCase().includes(query)))
      .slice()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this._loading.set(true);
    try {
      const tasks = await this.repo.list();
      this._tasks.set(tasks);
    } catch (err) {
      this.logger.error('TasksViewModel.load failed', err);
      throw err;
    } finally {
      this._loading.set(false);
    }
  }

  setSearch(query: string): void {
    this._search.set(query);
  }

  setFilter(status: StatusFilter): void {
    this._filterStatus.set(status);
  }

  startCreate(): void {
    this._editingId.set(null);
    this._formModel.set({ ...INITIAL_TASK_FORM });
  }

  startEdit(id: TaskId): void {
    const task = this._tasks().find((t) => t.id === id);
    if (!task) return;
    this._editingId.set(id);
    this._formModel.set({
      title: task.title,
      description: task.description ?? '',
      status: task.status,
      dueDate: task.dueDate ? toIsoDate(task.dueDate) : '',
    });
  }

  cancel(): void {
    this.startCreate();
  }

  async submit(): Promise<void> {
    await submit(this.form);
  }

  private async persist(): Promise<void> {
    const payload = buildTaskPayload(this._formModel());
    const editingId = this._editingId();
    try {
      if (editingId === null) {
        await this.repo.create(payload);
      } else {
        await this.repo.update(editingId, payload);
      }
      this.startCreate();
      await this.load();
    } catch (err) {
      this.logger.error('TasksViewModel.submit failed', err);
      throw err;
    }
  }

  async remove(id: TaskId): Promise<void> {
    try {
      await this.repo.delete(id);
      if (this._editingId() === id) {
        this.startCreate();
      }
      await this.load();
    } catch (err) {
      this.logger.error('TasksViewModel.remove failed', err);
      throw err;
    }
  }
}
