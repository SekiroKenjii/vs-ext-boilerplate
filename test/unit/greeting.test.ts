import { describe, expect, it } from 'vitest';

import { formatGreeting } from '../../src/core/greeting';

describe('formatGreeting', () => {
  it('combines the greeting and subject', () => {
    expect(formatGreeting('Hello', 'World')).toBe('Hello, World!');
  });

  it('trims surrounding whitespace', () => {
    expect(formatGreeting('  Hi  ', 'there')).toBe('Hi, there!');
  });

  it('falls back to a default when the greeting is blank', () => {
    expect(formatGreeting('   ', 'World')).toBe('Hello, World!');
  });
});
