export interface CounterState {
  readonly value: number;
  readonly step: number;
}

export const INITIAL_COUNTER_STATE: CounterState = {
  value: 0,
  step: 1,
};
