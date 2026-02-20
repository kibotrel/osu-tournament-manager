import type { BanchoLobbyState } from '@packages/shared';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { logger } from '#src/dependencies/logger.dependency.js';
import { setMatchStateInCacheService } from '#src/services/cache/cache.service.js';
import { getMatchStateService } from '#src/services/matches/matches.service.js';
import { webSocketServer } from '#src/websocketServer.js';

import { onMultiplayerPlayerMovedSlot } from './bancho.onMultiplayerPlayerMovedSlot.event.js';

vi.mock('#src/dependencies/logger.dependency.js', () => {
  return { logger: { debug: vi.fn(), warn: vi.fn() } };
});

vi.mock('#src/services/cache/cache.service.js', () => {
  return { setMatchStateInCacheService: vi.fn() };
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
      player: 'player1',
      selectedModifications: [],
    },
    {
      isHost: false,
      isReady: false,
      player: null,
      selectedModifications: [],
    },
  ],
  globalModifications: [],
};
const newMatchState: BanchoLobbyState = {
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

describe('onMultiplayerPlayerMovedSlot', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should update match state in cache', async () => {
    const setMatchStateInCacheServiceMock = vi.mocked(
      setMatchStateInCacheService,
    );
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerPlayerMovedSlot({
      channel: '#mp_1',
      slotNumber: 2,
      user: 'player1',
    });

    expect(getMatchStateServiceMock).toHaveBeenCalledWith(1);
    expect(setMatchStateInCacheServiceMock).toHaveBeenCalledWith({
      channel: 1,
      state: newMatchState,
    });
  });

  it('should broadcast new lobby state to subscribers', async () => {
    const webSocketServerMock = vi.mocked(
      webSocketServer.broadcastMessageToSubscribers,
    );
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerPlayerMovedSlot({
      channel: '#mp_1',
      slotNumber: 2,
      user: 'player1',
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

  it('should log a warning if the moved slot could not be found', async () => {
    const loggerWarnMock = vi.mocked(logger.warn);
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);
    const setMatchStateInCacheServiceMock = vi.mocked(
      setMatchStateInCacheService,
    );
    const webSocketServerMock = vi.mocked(
      webSocketServer.broadcastMessageToSubscribers,
    );

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerPlayerMovedSlot({
      channel: '#mp_1',
      slotNumber: 2,
      user: 'nonexistent_player',
    });

    expect(loggerWarnMock).toHaveBeenCalledWith(
      '[IRC] Could not find slot for nonexistent_player in channel #mp_1 when moving to slot 2',
    );
    expect(setMatchStateInCacheServiceMock).not.toHaveBeenCalled();
    expect(webSocketServerMock).not.toHaveBeenCalled();
  });
});
