import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { LoggerService } from '@core/services/logger.service';
import { NewTask, Task, TaskId, TaskPatch } from '@data/models/task.model';
import { TaskRepository } from '@data/repositories/task.repository';

import { TasksViewModel } from './tasks.viewmodel';

const id = (v: string): TaskId => v as TaskId;

class FakeTaskRepository extends TaskRepository {
  tasks: Task[] = [];
  private counter = 0;

  override list(): Promise<Task[]> {
    return Promise.resolve(this.tasks.map((t) => ({ ...t })));
  }

  override getById(taskId: TaskId): Promise<Task> {
    const found = this.tasks.find((t) => t.id === taskId);
    return found ? Promise.resolve({ ...found }) : Promise.reject(new Error('not found'));
  }

  override create(input: NewTask): Promise<Task> {
    const task: Task = { ...input, id: id(`t${++this.counter}`), createdAt: new Date() };
    this.tasks.push(task);
    return Promise.resolve({ ...task });
  }

  override update(taskId: TaskId, patch: TaskPatch): Promise<Task> {
    const index = this.tasks.findIndex((t) => t.id === taskId);
    if (index === -1) return Promise.reject(new Error('not found'));
    const next = { ...this.tasks[index], ...patch };
    this.tasks[index] = next;
    return Promise.resolve({ ...next });
  }

  override delete(taskId: TaskId): Promise<void> {
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    return Promise.resolve();
  }
}

const noop = (): void => undefined;
const noopLogger: LoggerService = {
  info: noop,
  warn: noop,
  error: noop,
  debug: noop,
} as LoggerService;

describe('TasksViewModel', () => {
  let vm: TasksViewModel;
  let repo: FakeTaskRepository;

  beforeEach(async () => {
    repo = new FakeTaskRepository();
    repo.tasks = [
      {
        id: id('a'),
        title: 'Alpha',
        status: 'todo',
        createdAt: new Date('2026-01-01T10:00:00Z'),
      },
      {
        id: id('b'),
        title: 'Beta task',
        status: 'in-progress',
        createdAt: new Date('2026-02-01T10:00:00Z'),
      },
      {
        id: id('c'),
        title: 'Gamma',
        status: 'done',
        createdAt: new Date('2026-03-01T10:00:00Z'),
      },
    ];
    TestBed.configureTestingModule({
      providers: [
        TasksViewModel,
        { provide: TaskRepository, useValue: repo },
        { provide: LoggerService, useValue: noopLogger },
      ],
    });
    vm = TestBed.inject(TasksViewModel);
    await vm.load();
  });

  it('charge les tâches depuis le repository', () => {
    expect(vm.tasks().length).toBe(3);
    expect(vm.loading()).toBe(false);
  });

  it('trie les tâches filtrées par createdAt desc', () => {
    expect(vm.filteredTasks().map((t) => t.id)).toEqual([id('c'), id('b'), id('a')]);
  });

  it('filtre la liste par recherche insensible à la casse', () => {
    vm.setSearch('BETA');
    expect(vm.filteredTasks().map((t) => t.id)).toEqual([id('b')]);
  });

  it('filtre la liste par statut', () => {
    vm.setFilter('done');
    expect(vm.filteredTasks().map((t) => t.id)).toEqual([id('c')]);
  });

  it('signale une erreur si le titre est vide', () => {
    expect(vm.form().valid()).toBe(false);
    expect(
      vm.form
        .title()
        .errors()
        .some((e) => e.kind === 'required'),
    ).toBe(true);
  });

  it('signale une erreur si le titre dépasse 100 caractères', () => {
    vm.form.title().value.set('x'.repeat(101));
    expect(vm.form().valid()).toBe(false);
    expect(
      vm.form
        .title()
        .errors()
        .some((e) => e.kind === 'maxLength'),
    ).toBe(true);
  });

  it('signale une erreur si la date est invalide', () => {
    vm.form.title().value.set('ok');
    vm.form.dueDate().value.set('not-a-date');
    expect(
      vm.form
        .dueDate()
        .errors()
        .some((e) => e.kind === 'invalidDate'),
    ).toBe(true);
    expect(vm.form().valid()).toBe(false);
  });

  it('considère le formulaire valide avec un titre propre', () => {
    vm.form.title().value.set('Nouvelle tâche');
    expect(vm.form().valid()).toBe(true);
    expect(vm.form.title().errors()).toEqual([]);
  });

  it('submit en mode création ajoute une tâche puis reset le form', async () => {
    vm.form.title().value.set('Nouvelle');
    vm.form.status().value.set('in-progress');
    await vm.submit();
    expect(repo.tasks.some((t) => t.title === 'Nouvelle' && t.status === 'in-progress')).toBe(true);
    expect(vm.form.title().value()).toBe('');
    expect(vm.editingId()).toBeNull();
  });

  it('startEdit hydrate le formulaire et fixe editingId', () => {
    vm.startEdit(id('b'));
    expect(vm.editingId()).toBe(id('b'));
    expect(vm.form.title().value()).toBe('Beta task');
    expect(vm.form.status().value()).toBe('in-progress');
    expect(vm.isEditing()).toBe(true);
  });

  it('submit en mode édition appelle update avec le bon id', async () => {
    vm.startEdit(id('a'));
    vm.form.title().value.set('Alpha modifié');
    await vm.submit();
    const a = repo.tasks.find((t) => t.id === id('a'));
    expect(a?.title).toBe('Alpha modifié');
    expect(vm.editingId()).toBeNull();
  });

  it('cancel reset le formulaire et sort du mode édition', () => {
    vm.startEdit(id('a'));
    vm.cancel();
    expect(vm.editingId()).toBeNull();
    expect(vm.form.title().value()).toBe('');
  });

  it('remove supprime la tâche et recharge la liste', async () => {
    await vm.remove(id('a'));
    expect(repo.tasks.some((t) => t.id === id('a'))).toBe(false);
    expect(vm.tasks().some((t) => t.id === id('a'))).toBe(false);
  });
});
