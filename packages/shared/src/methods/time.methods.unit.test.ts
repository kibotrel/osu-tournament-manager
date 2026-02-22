import { describe, expect, it } from 'vitest';

import { sleep } from '#src/methods/time.methods.js';

describe('sleep', () => {
  it('should delay execution for at least the requested duration', async () => {
    const delay = 25;
    const before = Date.now();

    await sleep(delay);

    const after = Date.now();

    expect(after - before).toBeGreaterThanOrEqual(delay);
  });
});
