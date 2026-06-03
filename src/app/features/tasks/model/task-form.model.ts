import { maxLength, required, schema, validate } from '@angular/forms/signals';

import { NewTask, TaskStatus } from '@data/models/task.model';

export interface TaskFormState {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
}

export const INITIAL_TASK_FORM: TaskFormState = {
  title: '',
  description: '',
  status: 'todo',
  dueDate: '',
};

export const TASK_STATUSES: readonly TaskStatus[] = ['todo', 'in-progress', 'done'];

export const TASK_STATUS_LABELS: Readonly<Record<TaskStatus, string>> = {
  todo: 'À faire',
  'in-progress': 'En cours',
  done: 'Terminé',
};

export const TITLE_MAX_LENGTH = 100;

export const taskFormSchema = schema<TaskFormState>((task) => {
  required(task.title, { message: 'Le titre est requis.' });
  maxLength(task.title, TITLE_MAX_LENGTH, {
    message: `Le titre doit faire au plus ${TITLE_MAX_LENGTH} caractères.`,
  });
  validate(task.dueDate, ({ value }) => {
    const v = value();
    if (v === '' || !Number.isNaN(Date.parse(v))) return null;
    return { kind: 'invalidDate', message: 'Date invalide.' };
  });
});

export const buildTaskPayload = (form: TaskFormState): NewTask => {
  const description = form.description.trim();
  return {
    title: form.title.trim(),
    description: description === '' ? undefined : description,
    status: form.status,
    dueDate: form.dueDate === '' ? undefined : new Date(form.dueDate),
  };
};

export const toIsoDate = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
