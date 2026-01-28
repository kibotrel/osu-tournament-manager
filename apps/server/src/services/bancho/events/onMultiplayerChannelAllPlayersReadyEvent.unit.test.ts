import type { BanchoLobbyState } from '@packages/shared';
import { describe, expect, it, vi } from 'vitest';

import { setMatchStateInCache } from '#src/services/cache/cacheService.js';
import { getMatchStateService } from '#src/services/matches/matchesService.js';
import { webSocketServer } from '#src/websocketServer.js';

import { onMultiplayerChannelAllPlayersReady } from './onMultiplayerChannelAllPlayersReadyEvent.js';

vi.mock('#src/dependencies/loggerDependency.js', () => {
  return { logger: { debug: vi.fn() } };
});

vi.mock('#src/services/cache/cacheService.js', () => {
  return { setMatchStateInCache: vi.fn() };
});

vi.mock('#src/services/matches/matchesService.js', () => {
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
  playerCount: 2,
  slots: [
    {
      isHost: true,
      isReady: false,
      player: 'player1',
      selectedModifications: [],
    },
    {
      isHost: false,
      isReady: false,
      player: 'player2',
      selectedModifications: [],
    },
  ],
  globalModifications: [],
};
const newMatchState: BanchoLobbyState = {
  playerCount: 2,
  slots: [
    {
      isHost: true,
      isReady: true,
      player: 'player1',
      selectedModifications: [],
    },
    {
      isHost: false,
      isReady: true,
      player: 'player2',
      selectedModifications: [],
    },
  ],
  globalModifications: [],
};

describe('onMultiplayerChannelAllPlayersReady', () => {
  it('should update match state in cache', async () => {
    const setMatchStateInCacheMock = vi.mocked(setMatchStateInCache);
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerChannelAllPlayersReady({ channel: '#mp_1' });

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
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerChannelAllPlayersReady({ channel: '#mp_1' });

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
