import { describe, expect, it } from 'vitest';

import { gameMatchIdFromBanchoChannel } from '#src/methods/string.methods.js';

describe('gameMatchIdFromBanchoChannel', () => {
  it('should return id of bancho channel', () => {
    const id = gameMatchIdFromBanchoChannel('#mp_123456');

    expect(id).toBe(123_456);
  });

  it('should return NaN if string is shorter than 4 characters', () => {
    const id = gameMatchIdFromBanchoChannel('1234');

    expect(Number.isNaN(id)).toBe(true);
  });

  it('should return NaN if leftover string is not numeric', () => {
    const id = gameMatchIdFromBanchoChannel('not a bancho channel');

    expect(Number.isNaN(id)).toBe(true);
  });

  it('should return NaN if leftover string represents infinity', () => {
    const id = gameMatchIdFromBanchoChannel('#mp_Infinity');

    expect(Number.isNaN(id)).toBe(true);
  });

  it('should return NaN if leftover string represent null', () => {
    const id = gameMatchIdFromBanchoChannel('#mp_null');

    expect(Number.isNaN(id)).toBe(true);
  });

  it('should return NaN if leftover string represent undefined', () => {
    const id = gameMatchIdFromBanchoChannel('#mp_undefined');

    expect(Number.isNaN(id)).toBe(true);
  });
});
