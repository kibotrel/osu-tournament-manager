import { describe, expect, it } from 'vitest';

import {
  isDirectMessageChannel,
  isPublicChannel,
} from '#src/methods/typeGardMethods.js';

describe('isDirectMessageChannel', () => {
  it('should return true if input is a direct message channel', () => {
    expect(isDirectMessageChannel('username')).toBe(true);
  });

  it('should return false if input is a public channel', () => {
    expect(isDirectMessageChannel('#channel')).toBe(false);
  });
});

describe('isPublicChannel', () => {
  it('should return true if input is a public channel', () => {
    expect(isPublicChannel('#channel')).toBe(true);
  });

  it('should return false if input is a direct message channel', () => {
    expect(isPublicChannel('username')).toBe(false);
  });
});
