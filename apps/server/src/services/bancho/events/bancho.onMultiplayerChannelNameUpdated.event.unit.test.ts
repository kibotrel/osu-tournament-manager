import type { BanchoLobbyState } from '@packages/shared';
import { describe, expect, it, vi } from 'vitest';

import { setMatchStateInCache } from '#src/services/cache/cache.service.js';
import { getMatchStateService } from '#src/services/matches/matches.service.js';
import { webSocketServer } from '#src/websocketServer.js';

import { onMultiplayerChannelNameUpdated } from './bancho.onMultiplayerChannelNameUpdated.event.js';

vi.mock('#src/dependencies/logger.dependency.js', () => {
  return { logger: { debug: vi.fn() } };
});

vi.mock('#src/services/cache/cache.service.js', () => {
  return { setMatchStateInCache: vi.fn() };
});

vi.mock('#src/services/matches/matches.service.js', () => {
  return { getMatchStateService: vi.fn() };
});

vi.mock('#src/websocketServer.js', () => {
  return {
    webSocketServer: {
      broadcastMessageToSubscribers: vi.fn(),
    },
  };
});

const mockOldMatchState: BanchoLobbyState = {
  playerCount: 0,
  slots: [],
  globalModifications: [],
  name: 'Old match name',
};
const newMatchState: BanchoLobbyState = {
  playerCount: 0,
  slots: [],
  globalModifications: [],
  name: 'New match name',
};

describe('onMultiplayerChannelNameUpdated', () => {
  it('should update match state in cache', async () => {
    const setMatchStateInCacheMock = vi.mocked(setMatchStateInCache);
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerChannelNameUpdated({
      channel: '#mp_1',
      name: 'New match name',
    });

    expect(getMatchStateServiceMock).toHaveBeenCalledWith(1);
    expect(setMatchStateInCacheMock).toHaveBeenCalledWith({
      channel: 1,
      state: newMatchState,
    });
  });

  it('should broadcast updated match state to websocket subscribers', async () => {
    const webSocketServerMock = vi.mocked(
      webSocketServer.broadcastMessageToSubscribers,
    );

    await onMultiplayerChannelNameUpdated({
      channel: '#mp_1',
      name: 'New match name',
    });

    expect(webSocketServerMock).toHaveBeenCalledWith(expect.any(Buffer), {
      isBinary: false,
      isBanchoMessage: true,
    });

    const payload = JSON.parse(webSocketServerMock.mock.calls[0][0].toString());

    expect(payload).toEqual({
      message: newMatchState,
      timestamp: expect.any(Number),
      topic: 'matches:1:lobby-state',
    });
  });
});
