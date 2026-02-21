import { describe, expect, it, vi } from 'vitest';

import { patchMatchByGameMatchIdQuery } from '#src/queries/matches/matches.update.queries.js';
import {
  deleteMatchChatHistoryFromCacheService,
  deleteMatchStateFromCacheService,
  removeMatchFromCachedSetService,
} from '#src/services/cache/cache.service.js';
import { webSocketServer } from '#src/websocketServer.js';

import { onMultiplayerChannelClosedEvent } from './bancho.onMultiplayerChannelClosed.event.js';

vi.mock('#src/dependencies/logger.dependency.js', () => {
  return { logger: { debug: vi.fn() } };
});

vi.mock('#src/queries/matches/matches.update.queries.js', () => {
  return { patchMatchByGameMatchIdQuery: vi.fn() };
});

vi.mock('#src/websocketServer.js', () => {
  return { webSocketServer: { disconnectAllTopicSubscribers: vi.fn() } };
});

vi.mock('#src/services/cache/cache.service.js', () => {
  return {
    deleteMatchChatHistoryFromCacheService: vi.fn(),
    deleteMatchStateFromCacheService: vi.fn(),
    removeMatchFromCachedSetService: vi.fn(),
  };
});

describe('onMultiplayerChannelClosedEvent', () => {
  it('should delete all match data from cache', async () => {
    const spyPromiseAll = vi.spyOn(Promise, 'all');

    await onMultiplayerChannelClosedEvent({
      channel: '#mp_1',
    });

    expect(deleteMatchChatHistoryFromCacheService).toHaveBeenCalledWith(1);
    expect(deleteMatchStateFromCacheService).toHaveBeenCalledWith(1);
    expect(patchMatchByGameMatchIdQuery).toHaveBeenCalledWith(1, {
      endsAt: expect.any(Date),
    });
    expect(removeMatchFromCachedSetService).toHaveBeenCalledWith('#mp_1');
    expect(webSocketServer.disconnectAllTopicSubscribers).toHaveBeenCalledWith(
      'matches:1:chat-messages',
    );
    expect(webSocketServer.disconnectAllTopicSubscribers).toHaveBeenCalledWith(
      'matches:1:lobby-state',
    );

    expect(spyPromiseAll).toHaveBeenCalled();
    expect(spyPromiseAll.mock.calls[0][0]).toHaveLength(6);
  });
});
