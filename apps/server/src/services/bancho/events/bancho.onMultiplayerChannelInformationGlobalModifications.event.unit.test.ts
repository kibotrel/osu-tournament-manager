import type { BanchoLobbyState } from '@packages/shared';
import { OsuBeatmapModification } from '@packages/shared';
import { describe, expect, it, vi } from 'vitest';

import { setMatchStateInCacheService } from '#src/services/cache/cache.service.js';
import { getMatchStateService } from '#src/services/matches/matches.service.js';
import { webSocketServer } from '#src/websocketServer.js';

import { onMultiplayerChannelInformationGlobalModificationsEvent } from './bancho.onMultiplayerChannelInformationGlobalModifications.event.js';

vi.mock('#src/dependencies/logger.dependency.js', () => {
  return { logger: { debug: vi.fn() } };
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
  slots: [],
  globalModifications: [OsuBeatmapModification.Hidden],
};
const newMatchState: BanchoLobbyState = {
  playerCount: 1,
  slots: [],
  globalModifications: [
    OsuBeatmapModification.Hidden,
    OsuBeatmapModification.DoubleTime,
  ],
};

describe('onMultiplayerChannelInformationGlobalModificationsEvent', () => {
  it('should update match state in cache', async () => {
    const setMatchStateInCacheServiceMock = vi.mocked(
      setMatchStateInCacheService,
    );
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerChannelInformationGlobalModificationsEvent({
      channel: '#mp_1',
      modifications: [
        OsuBeatmapModification.Hidden,
        OsuBeatmapModification.DoubleTime,
      ],
    });

    expect(getMatchStateServiceMock).toHaveBeenCalledWith(1);
    expect(setMatchStateInCacheServiceMock).toHaveBeenCalledWith({
      channel: 1,
      state: newMatchState,
    });
  });

  it('should broadcast updated match state to websocket subscribers', async () => {
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);
    const webSocketServerMock = vi.mocked(
      webSocketServer.broadcastMessageToSubscribers,
    );

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerChannelInformationGlobalModificationsEvent({
      channel: '#mp_1',
      modifications: [
        OsuBeatmapModification.Hidden,
        OsuBeatmapModification.DoubleTime,
      ],
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

  it('should remove DoubleTime when Nightcore is enabled', async () => {
    const newMatchStateSpecialCaseNightcore: BanchoLobbyState = {
      playerCount: 1,
      slots: [],
      globalModifications: [
        OsuBeatmapModification.Hidden,
        OsuBeatmapModification.Nightcore,
      ],
    };
    const setMatchStateInCacheServiceMock = vi.mocked(
      setMatchStateInCacheService,
    );
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerChannelInformationGlobalModificationsEvent({
      channel: '#mp_1',
      modifications: [
        OsuBeatmapModification.Hidden,
        OsuBeatmapModification.DoubleTime,
        OsuBeatmapModification.Nightcore,
      ],
    });

    expect(getMatchStateServiceMock).toHaveBeenCalledWith(1);
    expect(setMatchStateInCacheServiceMock).toHaveBeenCalledWith({
      channel: 1,
      state: newMatchStateSpecialCaseNightcore,
    });
  });

  it('should remove Freemod whenever it is enabled', async () => {
    const setMatchStateInCacheServiceMock = vi.mocked(
      setMatchStateInCacheService,
    );
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerChannelInformationGlobalModificationsEvent({
      channel: '#mp_1',
      modifications: [
        OsuBeatmapModification.Hidden,
        OsuBeatmapModification.DoubleTime,
        OsuBeatmapModification.FreeModification,
      ],
    });

    expect(getMatchStateServiceMock).toHaveBeenCalledWith(1);
    expect(setMatchStateInCacheServiceMock).toHaveBeenCalledWith({
      channel: 1,
      state: newMatchState,
    });
  });
});
