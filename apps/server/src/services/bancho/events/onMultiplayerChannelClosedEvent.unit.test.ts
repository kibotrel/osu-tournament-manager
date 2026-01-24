import { describe, expect, it, vi } from 'vitest';

import {
  deleteMatchChatHistoryFromCache,
  deleteMatchStateFromCache,
  removeMatchFromCachedSet,
} from '#src/services/cache/cacheService.js';

import { onMultiplayerChannelClosed } from './onMultiplayerChannelClosedEvent.js';

vi.mock('#src/dependencies/loggerDependency.js', () => {
  return { logger: { debug: vi.fn() } };
});

vi.mock('#src/services/cache/cacheService.js', () => {
  return {
    deleteMatchChatHistoryFromCache: vi.fn(),
    deleteMatchStateFromCache: vi.fn(),
    removeMatchFromCachedSet: vi.fn(),
  };
});

describe('onMultiplayerChannelClosed', () => {
  it('should delete all match data from cache', async () => {
    const spyPromiseAll = vi.spyOn(Promise, 'all');

    await onMultiplayerChannelClosed({
      channel: '#mp_1',
    });

    expect(deleteMatchChatHistoryFromCache).toHaveBeenCalledWith(1);
    expect(deleteMatchStateFromCache).toHaveBeenCalledWith(1);
    expect(removeMatchFromCachedSet).toHaveBeenCalledWith('#mp_1');

    expect(spyPromiseAll).toHaveBeenCalled();
    expect(spyPromiseAll.mock.calls[0][0]).toHaveLength(3);
  });
});
