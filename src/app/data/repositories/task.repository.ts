import { Injectable } from '@angular/core';

import { NewTask, Task, TaskId, TaskPatch } from '@data/models/task.model';

/**
 * Contrat repository pour les tâches. Sert aussi de token DI grâce à la classe abstraite.
 * Toute implémentation (in-memory, HTTP, etc.) doit étendre cette classe.
 */
export abstract class TaskRepository {
  abstract list(): Promise<Task[]>;
  abstract getById(id: TaskId): Promise<Task>;
  abstract create(input: NewTask): Promise<Task>;
  abstract update(id: TaskId, patch: TaskPatch): Promise<Task>;
  abstract delete(id: TaskId): Promise<void>;
}

const newId = (): TaskId => crypto.randomUUID() as TaskId;

const seed = (): Task[] => [
  {
    id: newId(),
    title: 'Découvrir le pattern MVVM',
    description: 'Lire docs/ARCHITECTURE.md et explorer la feature counter.',
    status: 'done',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: newId(),
    title: 'Implémenter une feature CRUD',
    description: 'Construire le module tasks avec un repository in-memory.',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: newId(),
    title: 'Brancher un vrai backend',
    description: 'Remplacer InMemoryTaskRepository par une impl HttpClient.',
    status: 'todo',
    createdAt: new Date(),
  },
];

/**
 * Implémentation in-memory pour la démo locale. Aucune persistance entre refresh.
 * Latence simulée pour rester proche d'un vrai appel réseau.
 */
@Injectable()
export class InMemoryTaskRepository extends TaskRepository {
  private tasks: Task[] = seed();

  override async list(): Promise<Task[]> {
    await this.delay();
    return this.tasks.map(clone);
  }

  override async getById(id: TaskId): Promise<Task> {
    await this.delay();
    const found = this.tasks.find((t) => t.id === id);
    if (!found) {
      throw new Error(`Task ${id} introuvable`);
    }
    return clone(found);
  }

  override async create(input: NewTask): Promise<Task> {
    await this.delay();
    const task: Task = { ...input, id: newId(), createdAt: new Date() };
    this.tasks = [...this.tasks, task];
    return clone(task);
  }

  override async update(id: TaskId, patch: TaskPatch): Promise<Task> {
    await this.delay();
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Task ${id} introuvable`);
    }
    const updated: Task = { ...this.tasks[index], ...patch };
    this.tasks = this.tasks.map((t, i) => (i === index ? updated : t));
    return clone(updated);
  }

  override async delete(id: TaskId): Promise<void> {
    await this.delay();
    const next = this.tasks.filter((t) => t.id !== id);
    if (next.length === this.tasks.length) {
      throw new Error(`Task ${id} introuvable`);
    }
    this.tasks = next;
  }

  private delay(ms = 150): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

const clone = (t: Task): Task => ({ ...t });
