import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { CounterViewModel } from './counter.viewmodel';

describe('CounterViewModel', () => {
  let vm: CounterViewModel;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CounterViewModel] });
    vm = TestBed.inject(CounterViewModel);
  });

  it('starts at 0 with step 1', () => {
    expect(vm.value()).toBe(0);
    expect(vm.step()).toBe(1);
    expect(vm.isZero()).toBe(true);
  });

  it('increments by step', () => {
    vm.increment();
    expect(vm.value()).toBe(1);
    vm.setStep(5);
    vm.increment();
    expect(vm.value()).toBe(6);
  });

  it('computes parity', () => {
    vm.setStep(2);
    vm.increment();
    expect(vm.parity()).toBe('pair');
    vm.setStep(1);
    vm.increment();
    expect(vm.parity()).toBe('impair');
  });

  it('resets to zero', () => {
    vm.increment();
    vm.increment();
    vm.reset();
    expect(vm.value()).toBe(0);
  });

  it('clamps step to a positive integer', () => {
    vm.setStep(-3);
    expect(vm.step()).toBe(1);
    vm.setStep(2.7);
    expect(vm.step()).toBe(2);
  });
});
