import type { BanchoLobbyState } from '@packages/shared';
import { BanchoTeamMode, BanchoWinCondition } from '@packages/shared';
import { describe, expect, it, vi } from 'vitest';

import { setMatchStateInCache } from '#src/services/cache/cacheService.js';
import { getMatchStateService } from '#src/services/matches/matchesService.js';
import { webSocketServer } from '#src/websocketServer.js';

import { onMultiplayerChannelInformationConditions } from './onMultiplayerChannelInformationConditionsEvent.js';

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
  playerCount: 1,
  slots: [
    {
      isHost: true,
      isReady: false,
      player: 'player1',
      selectedModifications: [],
    },
  ],
  globalModifications: [],
  teamMode: BanchoTeamMode.HeadToHead,
  winCondition: BanchoWinCondition.ScoreV2,
};
const newMatchState: BanchoLobbyState = {
  playerCount: 1,
  slots: [
    {
      isHost: true,
      isReady: false,
      player: 'player1',
      selectedModifications: [],
    },
  ],
  globalModifications: [],
  teamMode: BanchoTeamMode.TeamVs,
  winCondition: BanchoWinCondition.Accuracy,
};

describe('onMultiplayerChannelInformationConditions', () => {
  it('should update match state in cache', async () => {
    const setMatchStateInCacheMock = vi.mocked(setMatchStateInCache);
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);

    getMatchStateServiceMock.mockResolvedValueOnce(mockOldMatchState);

    await onMultiplayerChannelInformationConditions({
      channel: '#mp_1',
      teamMode: BanchoTeamMode.TeamVs,
      winCondition: BanchoWinCondition.Accuracy,
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

    await onMultiplayerChannelInformationConditions({
      channel: '#mp_1',
      teamMode: BanchoTeamMode.TeamVs,
      winCondition: BanchoWinCondition.Accuracy,
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
