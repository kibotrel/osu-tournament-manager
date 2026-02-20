import type { BanchoLobbyState } from '@packages/shared';
import { describe, expect, it, vi } from 'vitest';

import { setMatchStateInCache } from '#src/services/cache/cache.service.js';
import { getMatchStateService } from '#src/services/matches/matches.service.js';
import { webSocketServer } from '#src/websocketServer.js';

import { onMultiplayerPlayerJoinedSlot } from './bancho.onMultiplayerPlayerJoinedSlot.event.js';

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
  playerCount: 1,
  slots: [
    {
      isHost: false,
      isReady: false,
      player: null,
      selectedModifications: [],
    },
    {
      isHost: false,
      isReady: false,
      player: 'player1',
      selectedModifications: [],
    },
  ],
  globalModifications: [],
};
const newMatchState: BanchoLobbyState = {
  playerCount: 2,
  slots: [
    {
      isHost: false,
      isReady: false,
      player: 'player2',
      selectedModifications: [],
    },
    {
      isHost: false,
      isReady: false,
      player: 'player1',
      selectedModifications: [],
    },
  ],
  globalModifications: [],
};

describe('onMultiplayerPlayerJoinedSlot', () => {
  it('should update match state in cache', async () => {
    const setMatchStateInCacheMock = vi.mocked(setMatchStateInCache);
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerPlayerJoinedSlot({
      channel: '#mp_1',
      slotNumber: 1,
      user: 'player2',
    });

    expect(getMatchStateServiceMock).toHaveBeenCalledWith(1);
    expect(setMatchStateInCacheMock).toHaveBeenCalledWith({
      channel: 1,
      state: newMatchState,
    });
  });

  it('should broadcast new match state to websocket subscribers', async () => {
    const webSocketServerMock = vi.mocked(
      webSocketServer.broadcastMessageToSubscribers,
    );
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);
    await onMultiplayerPlayerJoinedSlot({
      channel: '#mp_1',
      slotNumber: 1,
      user: 'player2',
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
