import { describe, expect, it } from 'vitest';

import { formatTimestamp } from '#src/methods/numberMethods.js';

describe('formatTimestamp', () => {
  it('shourld transform timestamp to HH:mm:ss format in UTC timezone', () => {
    const timestamp = Date.UTC(2025, 0, 1, 14, 30, 25);
    const formattedTimestamp = formatTimestamp(timestamp);

    expect(formattedTimestamp).toBe('14:30:25');
  });
});
