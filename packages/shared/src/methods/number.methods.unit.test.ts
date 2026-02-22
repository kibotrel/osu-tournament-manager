import { describe, expect, it } from 'vitest';

import {
  banchoChannelFromGameMatchId,
  exponentialBackoffDelay,
  formatTimestamp,
} from '#src/methods/number.methods.js';

describe('banchoChannelFromGameMatchId', () => {
  it('should convert an integer to bancho channel identifier', () => {
    const gameMatchId = 123_456_789;
    const channelName = banchoChannelFromGameMatchId(gameMatchId);

    expect(channelName).toBe(`#mp_${gameMatchId}`);
  });
});

describe('exponentialBackoffDelay', () => {
  it('should return base delay on 1st attempt', () => {
    const delay = exponentialBackoffDelay({ attempt: 0 });

    expect(delay).toBe(1000);
  });

  it('should return exponentially larger delay as attempt increase', () => {
    const delay1 = exponentialBackoffDelay({ attempt: 1 });
    const delay2 = exponentialBackoffDelay({ attempt: 2 });
    const delay3 = exponentialBackoffDelay({ attempt: 3 });

    expect(delay3 - delay2).toBeGreaterThan(delay2 - delay1);
  });

  it('should return at most maxDelay when computed delay is higher', () => {
    const delay = exponentialBackoffDelay({ attempt: 25 });

    expect(delay).toBe(30_000);
  });

  it('should throw an error if attempt is negative', () => {
    try {
      exponentialBackoffDelay({ attempt: -1 });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'Attempt must be a positive integer',
        }),
      );
    }
  });

  it('should throw an error if attempt is not an integer', () => {
    try {
      exponentialBackoffDelay({ attempt: 2.7 });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toEqual(
        expect.objectContaining({
          message: 'Attempt must be a positive integer',
        }),
      );
    }
  });
});

describe('formatTimestamp', () => {
  it('should transform timestamp to HH:mm:ss format in UTC timezone', () => {
    const timestamp = Date.UTC(2025, 0, 1, 14, 30, 25);
    const formattedTimestamp = formatTimestamp(timestamp);

    expect(formattedTimestamp).toBe('14:30:25');
  });
});
