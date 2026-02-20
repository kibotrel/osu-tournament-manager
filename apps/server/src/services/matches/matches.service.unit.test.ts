import type { WebSocketMatchMessage, WebSocketMessage } from '@packages/shared';
import * as shared from '@packages/shared';
import {
  HttpInternalServerError,
  HttpNotFoundError,
  HttpUnprocessableContentError,
} from '@packages/shared';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { banchoClient } from '#src/dependencies/ircClient.dependency.js';
import { createMatch } from '#src/queries/matches/matches.create.queries.js';
import {
  getMatchByGameMatchId,
  getMatchById,
} from '#src/queries/matches/matches.get.queries.js';
import type { SelectMatch } from '#src/schemas/matches/matches.matches.table.js';
import { openMultiplayerChannelService } from '#src/services/bancho/bancho.multiplayer.service.js';
import {
  getMatchChatHistoryFromCacheService,
  getMatchStateFromCacheService,
  removeMatchFromCachedSetService,
} from '#src/services/cache/cache.service.js';

import {
  closeMatchService,
  getMatchChatHistoryService,
  getMatchService,
  getMatchStateService,
  openMatchService,
} from './matches.service.js';

vi.mock('#src/dependencies/ircClient.dependency.js', () => {
  return { banchoClient: { closeMultiplayerChannel: vi.fn() } };
});

vi.mock('#src/services/cache/cache.service.js', () => {
  return {
    deleteMatchChatHistoryFromCacheService: vi.fn(),
    getMatchChatHistoryFromCacheService: vi.fn(),
    getMatchStateFromCacheService: vi.fn(),
    removeMatchFromCachedSetService: vi.fn(),
  };
});

vi.mock('#src/websocketServer.js', () => {
  return { webSocketServer: { disconnectAllTopicSubscribers: vi.fn() } };
});

vi.mock('#src/queries/matches/matches.update.queries.js', () => {
  return { patchMatchById: vi.fn(), patchMatchByGameMatchId: vi.fn() };
});

vi.mock('#src/queries/matches/matches.get.queries.js', () => {
  return { getMatchById: vi.fn(), getMatchByGameMatchId: vi.fn() };
});

vi.mock('#src/services/bancho/bancho.multiplayer.service.js', () => {
  return { openMultiplayerChannelService: vi.fn() };
});

vi.mock('#src/queries/matches/matches.create.queries.js', () => {
  return { createMatch: vi.fn() };
});

describe('closeMatchService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should close bancho channel and update match in database if not already closed', async () => {
    const id = 1;
    const getMatchByGameMatchIdMock = vi.mocked(getMatchByGameMatchId);
    const banchoChannelFromGameMatchIdSpy = vi.spyOn(
      shared,
      'banchoChannelFromGameMatchId',
    );
    const match = { gameMatchId: 123_456, id, endsAt: null };

    getMatchByGameMatchIdMock.mockResolvedValueOnce(match as SelectMatch);

    const { status } = await closeMatchService(id);

    expect(getMatchByGameMatchId).toHaveBeenCalledWith(id, {
      columnsFilter: ['endsAt', 'gameMatchId', 'gameMatchId', 'id'],
    });
    expect(banchoChannelFromGameMatchIdSpy).toHaveBeenCalledWith(
      match.gameMatchId,
    );
    expect(banchoClient.closeMultiplayerChannel).toHaveBeenCalledWith(
      `#mp_${match.gameMatchId}`,
    );
    expect(status).toBe('closed');
  });

  it('should throw HttpNotFoundError if match does not exist', async () => {
    const id = 1;
    const getMatchByIdMock = vi.mocked(getMatchById);
    const banchoChannelFromGameMatchIdSpy = vi.spyOn(
      shared,
      'banchoChannelFromGameMatchId',
    );

    getMatchByIdMock.mockResolvedValueOnce(null);

    try {
      await closeMatchService(id);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpNotFoundError);
      expect(error).toEqual(
        expect.objectContaining({ message: 'Match not found' }),
      );
    }

    expect(getMatchByGameMatchId).toHaveBeenCalledWith(id, {
      columnsFilter: ['endsAt', 'gameMatchId', 'gameMatchId', 'id'],
    });

    expect(banchoChannelFromGameMatchIdSpy).not.toHaveBeenCalled();
    expect(banchoClient.closeMultiplayerChannel).not.toHaveBeenCalled();
  });

  it('should throw HttpUnprocessableContentError if match already closed', async () => {
    const id = 1;
    const getMatchByGameMatchIdMock = vi.mocked(getMatchByGameMatchId);
    const banchoChannelFromGameMatchIdSpy = vi.spyOn(
      shared,
      'banchoChannelFromGameMatchId',
    );
    const match = { gameMatchId: 123_456, id, endsAt: new Date() };

    getMatchByGameMatchIdMock.mockResolvedValueOnce(match as SelectMatch);

    try {
      await closeMatchService(id);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpUnprocessableContentError);
      expect(error).toEqual(
        expect.objectContaining({ message: 'Match already closed' }),
      );
    }

    expect(getMatchByGameMatchId).toHaveBeenCalledWith(id, {
      columnsFilter: ['endsAt', 'gameMatchId', 'gameMatchId', 'id'],
    });

    expect(banchoChannelFromGameMatchIdSpy).not.toHaveBeenCalled();
    expect(banchoClient.closeMultiplayerChannel).not.toHaveBeenCalled();
  });
});

describe('getMatchService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return match if found', async () => {
    const id = 1;
    const getMatchByGameMatchIdMock = vi.mocked(getMatchByGameMatchId);
    const match = {
      endsAt: null,
      id,
      name: 'Test Match',
    };

    getMatchByGameMatchIdMock.mockResolvedValueOnce(match as SelectMatch);

    const result = await getMatchService(id);

    expect(getMatchByGameMatchId).toHaveBeenCalledWith(id, {
      columnsFilter: ['endsAt', 'gameMatchId', 'name'],
    });
    expect(result).toEqual(match);
  });

  it('should throw HttpNotFoundError if match not found', async () => {
    const id = 1;
    const getMatchByGameMatchIdMock = vi.mocked(getMatchByGameMatchId);

    getMatchByGameMatchIdMock.mockResolvedValueOnce(null);

    try {
      await getMatchService(id);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpNotFoundError);
      expect(error).toEqual(
        expect.objectContaining({ message: 'Match not found' }),
      );
    }

    expect(getMatchByGameMatchId).toHaveBeenCalledWith(id, {
      columnsFilter: ['endsAt', 'gameMatchId', 'name'],
    });
  });
});

describe('getMatchChatHistoryService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return an array of chat messages if found', async () => {
    const gameMatchId = 123_456;
    const chatHistory: Array<WebSocketMessage<WebSocketMatchMessage>> = [
      {
        message: {
          author: 'user',
          content: 'Hello',
        },
        timestamp: Date.now(),
        topic: `matches:${gameMatchId}:chat-messages`,
      },
    ];
    const getMatchChatHistoryFromCacheServiceMock = vi.mocked(
      getMatchChatHistoryFromCacheService,
    );

    getMatchChatHistoryFromCacheServiceMock.mockResolvedValueOnce(
      chatHistory.map((item) => {
        return JSON.stringify(item);
      }),
    );

    const result = await getMatchChatHistoryService(gameMatchId);

    expect(getMatchChatHistoryFromCacheService).toHaveBeenCalledWith(
      gameMatchId,
    );
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result).toEqual(chatHistory);
  });

  it('should return an empty array if no chat message is found', async () => {
    const gameMatchId = 123_456;
    const getMatchChatHistoryFromCacheServiceMock = vi.mocked(
      getMatchChatHistoryFromCacheService,
    );

    getMatchChatHistoryFromCacheServiceMock.mockResolvedValueOnce([]);

    const result = await getMatchChatHistoryService(gameMatchId);

    expect(getMatchChatHistoryFromCacheService).toHaveBeenCalledWith(
      gameMatchId,
    );
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });
});

describe('getMatchStateService', () => {
  it('should return match state from cache if found', async () => {
    const gameMatchId = 1;
    const cachedState: shared.BanchoLobbyState = {
      globalModifications: [],
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
          isReady: false,
          player: 'player2',
          selectedModifications: [],
        },
      ],
    };
    const getMatchStateFromCacheServiceMock = vi.mocked(
      getMatchStateFromCacheService,
    );

    getMatchStateFromCacheServiceMock.mockResolvedValueOnce(cachedState);

    const result = await getMatchStateService(gameMatchId);

    expect(getMatchStateFromCacheServiceMock).toHaveBeenCalledWith(gameMatchId);
    expect(result).toEqual(cachedState);
  });

  it('should return base match state if no state found in cache', async () => {
    const gameMatchId = 1;
    const getMatchStateFromCacheServiceMock = vi.mocked(
      getMatchStateFromCacheService,
    );

    getMatchStateFromCacheServiceMock.mockResolvedValueOnce(null);

    const result = await getMatchStateService(gameMatchId);

    expect(getMatchStateFromCacheServiceMock).toHaveBeenCalledWith(gameMatchId);
    expect(result).toEqual({
      globalModifications: [],
      playerCount: 0,
      slots: Array.from({ length: 16 }, () => {
        return {
          isHost: false,
          isReady: false,
          player: null,
          selectedModifications: [],
        };
      }),
    });
  });
});

describe('openMatchService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should open multiplayer channel on bancho and register match in database', async () => {
    const name = 'Test Match';
    const gameMatchId = 123_456;
    const openMultiplayerChannelServiceMock = vi.mocked(
      openMultiplayerChannelService,
    );
    const createMatchMock = vi.mocked(createMatch);
    const banchoChannelFromGameMatchIdSpy = vi.spyOn(
      shared,
      'banchoChannelFromGameMatchId',
    );
    const promiseAllSpy = vi.spyOn(Promise, 'all');
    const match = {
      bansPerTeam: 0,
      bestOf: 0,
      gameMatchId,
      endsAt: null,
      id: 1,
      isQualifierMatch: false,
      mappoolId: 1,
      name,
      protectsPerTeam: 0,
      startsAt: new Date(),
      tournamentId: 1,
    };

    openMultiplayerChannelServiceMock.mockResolvedValueOnce({ gameMatchId });
    createMatchMock.mockResolvedValueOnce(match as SelectMatch);

    const result = await openMatchService(name);

    expect(openMultiplayerChannelService).toHaveBeenCalledWith(name);
    expect(createMatch).toHaveBeenCalledWith({
      bansPerTeam: 0,
      bestOf: 0,
      gameMatchId,
      isQualifierMatch: false,
      mappoolId: 1,
      name,
      protectsPerTeam: 0,
      startsAt: expect.any(Date),
      tournamentId: 1,
    });
    expect(banchoChannelFromGameMatchIdSpy).not.toHaveBeenCalled();
    expect(banchoClient.closeMultiplayerChannel).not.toHaveBeenCalled();
    expect(removeMatchFromCachedSetService).not.toHaveBeenCalled();
    expect(promiseAllSpy).not.toHaveBeenCalled();
    expect(result).toEqual(match);
  });

  it('should throw HttpInternalServerError if opening multiplayer channel on bancho fails', async () => {
    const name = 'Test Match';
    const openMultiplayerChannelServiceMock = vi.mocked(
      openMultiplayerChannelService,
    );
    const banchoChannelFromGameMatchIdSpy = vi.spyOn(
      shared,
      'banchoChannelFromGameMatchId',
    );
    const promiseAllSpy = vi.spyOn(Promise, 'all');
    const errorToThrow = new Error('Failed to open channel');

    openMultiplayerChannelServiceMock.mockRejectedValueOnce(errorToThrow);

    try {
      await openMatchService(name);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpInternalServerError);
      expect(error).toEqual(
        expect.objectContaining({
          cause: errorToThrow,
          message: 'Failed to open bancho multiplayer channel',
          metadata: { name },
        }),
      );
    }

    expect(openMultiplayerChannelService).toHaveBeenCalledWith(name);
    expect(createMatch).not.toHaveBeenCalled();
    expect(banchoChannelFromGameMatchIdSpy).not.toHaveBeenCalled();
    expect(banchoClient.closeMultiplayerChannel).not.toHaveBeenCalled();
    expect(removeMatchFromCachedSetService).not.toHaveBeenCalled();
    expect(promiseAllSpy).not.toHaveBeenCalled();
  });

  it('should close bancho channel and remove it from cache before throwing HttpInternalServerError if registering match in database fails', async () => {
    const name = 'Test Match';
    const gameMatchId = 123_456;
    const openMultiplayerChannelServiceMock = vi.mocked(
      openMultiplayerChannelService,
    );
    const createMatchMock = vi.mocked(createMatch);
    const banchoChannelFromGameMatchIdSpy = vi.spyOn(
      shared,
      'banchoChannelFromGameMatchId',
    );
    const promiseAllSpy = vi.spyOn(Promise, 'all');
    const errorToThrow = new Error('Failed to create match in database');

    openMultiplayerChannelServiceMock.mockResolvedValueOnce({ gameMatchId });
    createMatchMock.mockRejectedValueOnce(errorToThrow);

    try {
      await openMatchService(name);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpInternalServerError);
      expect(error).toEqual(
        expect.objectContaining({
          cause: errorToThrow,
          message: 'Failed to create match in database',
          metadata: { name, gameMatchId },
        }),
      );
    }

    expect(openMultiplayerChannelService).toHaveBeenCalledWith(name);
    expect(createMatch).toHaveBeenCalledWith({
      bansPerTeam: 0,
      bestOf: 0,
      gameMatchId,
      isQualifierMatch: false,
      mappoolId: 1,
      name,
      protectsPerTeam: 0,
      startsAt: expect.any(Date),
      tournamentId: 1,
    });
    expect(banchoChannelFromGameMatchIdSpy).toHaveBeenCalledWith(gameMatchId);
    expect(banchoClient.closeMultiplayerChannel).toHaveBeenCalledWith(
      `#mp_${gameMatchId}`,
    );
    expect(removeMatchFromCachedSetService).toHaveBeenCalledWith(
      `#mp_${gameMatchId}`,
    );
    expect(promiseAllSpy).toHaveBeenCalled();
    expect(promiseAllSpy.mock.calls?.at(0)?.at(0)).toHaveLength(2);
  });
});
