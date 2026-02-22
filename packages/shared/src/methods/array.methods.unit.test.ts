import { describe, expect, it } from 'vitest';

import { formatList } from '#src/methods/array.methods.js';

describe('formatList', () => {
  it('should return a string with elements joined by a comma by default', () => {
    expect(formatList(['a', 'b', 'c'])).toBe('a,b,c');
  });

  it('should return an empty string if given an empty array', () => {
    expect(formatList([])).toBe('');
  });

  it('should return a string with elements joined by a custom separator', () => {
    expect(formatList(['a', 'b', 'c'], { separator: '-' })).toBe('a-b-c');
  });

  it('should remove empty string elements from the list', () => {
    expect(formatList(['a', '', 'c'], { removeEmpty: true })).toBe('a,c');
  });
});
