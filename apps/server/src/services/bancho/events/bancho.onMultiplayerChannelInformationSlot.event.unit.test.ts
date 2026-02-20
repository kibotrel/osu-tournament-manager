import {
  type BanchoLobbyState,
  OsuBeatmapModification,
} from '@packages/shared';
import { describe, expect, it, vi } from 'vitest';

import { setMatchStateInCache } from '#src/services/cache/cache.service.js';
import { getMatchStateService } from '#src/services/matches/matches.service.js';
import { webSocketServer } from '#src/websocketServer.js';

import { onMultiplayerChannelInformationSlot } from './bancho.onMultiplayerChannelInformationSlot.event.js';

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
      player: 'placeholder',
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
      isHost: true,
      isReady: true,
      player: 'player1',
      selectedModifications: [OsuBeatmapModification.Hidden],
    },
  ],
  globalModifications: [],
};

describe('onMultiplayerChannelInformationSlot', () => {
  it('should update match state in cache', async () => {
    const setMatchStateInCacheMock = vi.mocked(setMatchStateInCache);
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerChannelInformationSlot({
      channel: '#mp_1',
      gameUserId: 1,
      isHost: true,
      isReady: true,
      modifications: [OsuBeatmapModification.Hidden],
      slotNumber: 2,
      user: 'player1',
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
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerChannelInformationSlot({
      channel: '#mp_1',
      gameUserId: 1,
      isHost: true,
      isReady: true,
      modifications: [OsuBeatmapModification.Hidden],
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
});
