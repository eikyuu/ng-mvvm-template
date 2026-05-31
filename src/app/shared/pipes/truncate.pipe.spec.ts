import { describe, it, expect } from 'vitest';

import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();

  it('returns empty string for nullish input', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('returns the value unchanged when shorter than max', () => {
    expect(pipe.transform('hello', 10)).toBe('hello');
  });

  it('truncates and adds default ellipsis', () => {
    expect(pipe.transform('hello world', 5)).toBe('hello…');
  });

  it('uses custom suffix', () => {
    expect(pipe.transform('hello world', 5, '...')).toBe('hello...');
  });
});
