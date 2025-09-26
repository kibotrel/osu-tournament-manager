import { describe, expect, it } from 'vitest';

import {
  banchoChannelFromGameMatchId,
  formatTimestamp,
} from '#src/methods/numberMethods.js';

describe('formatTimestamp', () => {
  it('should transform timestamp to HH:mm:ss format in UTC timezone', () => {
    const timestamp = Date.UTC(2025, 0, 1, 14, 30, 25);
    const formattedTimestamp = formatTimestamp(timestamp);

    expect(formattedTimestamp).toBe('14:30:25');
  });
});

describe('banchoChannelFromGameMatchId', () => {
  it('should convert an integer to bancho channel identifier', () => {
    const gameMatchId = 123_456_789;
    const channelName = banchoChannelFromGameMatchId(gameMatchId);

    expect(channelName).toBe(`#mp_${gameMatchId}`);
  });
});
