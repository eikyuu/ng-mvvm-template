/**
 * Modèle de domaine `Task` — forme immuable. Aucune logique ici.
 */

export type TaskId = string & { readonly __brand: 'TaskId' };

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  readonly id: TaskId;
  readonly title: string;
  readonly description?: string;
  readonly status: TaskStatus;
  readonly dueDate?: Date;
  readonly createdAt: Date;
}

export type NewTask = Omit<Task, 'id' | 'createdAt'>;

export type TaskPatch = Partial<Omit<Task, 'id' | 'createdAt'>>;
