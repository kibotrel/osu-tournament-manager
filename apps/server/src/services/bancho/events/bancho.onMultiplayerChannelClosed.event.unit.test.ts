import { describe, expect, it, vi } from 'vitest';

import { patchMatchByGameMatchId } from '#src/queries/matches/matches.update.queries.js';
import {
  deleteMatchChatHistoryFromCache,
  deleteMatchStateFromCache,
  removeMatchFromCachedSet,
} from '#src/services/cache/cache.service.js';
import { webSocketServer } from '#src/websocketServer.js';

import { onMultiplayerChannelClosed } from './bancho.onMultiplayerChannelClosed.event.js';

vi.mock('#src/dependencies/logger.dependency.js', () => {
  return { logger: { debug: vi.fn() } };
});

vi.mock('#src/queries/matches/matches.update.queries.js', () => {
  return { patchMatchByGameMatchId: vi.fn() };
});

vi.mock('#src/websocketServer.js', () => {
  return { webSocketServer: { disconnectAllTopicSubscribers: vi.fn() } };
});

vi.mock('#src/services/cache/cache.service.js', () => {
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
    expect(patchMatchByGameMatchId).toHaveBeenCalledWith(1, {
      endsAt: expect.any(Date),
    });
    expect(removeMatchFromCachedSet).toHaveBeenCalledWith('#mp_1');
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
