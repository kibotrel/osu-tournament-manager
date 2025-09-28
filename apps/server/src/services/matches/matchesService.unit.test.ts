import * as shared from '@packages/shared';
import {
  HttpInternalServerError,
  HttpNotFoundError,
  HttpUnprocessableContentError,
} from '@packages/shared';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { banchoClient } from '#src/dependencies/ircClientDependency.js';
import { createMatch } from '#src/queries/matches/createMatchQueries.js';
import { getMatchById } from '#src/queries/matches/getMatchQueries.js';
import { patchMatchById } from '#src/queries/matches/updateMatchQueries.js';
import type { SelectMatch } from '#src/schemas/matches/matchesTable.js';
import { openMultiplayerChannel } from '#src/services/bancho/multiplayerService.js';
import { removeMatchFromCachedSet } from '#src/services/cache/cacheService.js';

import {
  closeMatchService,
  getMatchService,
  openMatchService,
} from './matchesService.js';

vi.mock('#src/dependencies/ircClientDependency.js', () => {
  return { banchoClient: { closeMultiplayerChannel: vi.fn() } };
});

vi.mock('#src/services/cache/cacheService.js', () => {
  return { removeMatchFromCachedSet: vi.fn() };
});

vi.mock('#src/queries/matches/updateMatchQueries.js', () => {
  return { patchMatchById: vi.fn() };
});

vi.mock('#src/queries/matches/getMatchQueries.js', () => {
  return { getMatchById: vi.fn() };
});

vi.mock('#src/services/bancho/multiplayerService.js', () => {
  return { openMultiplayerChannel: vi.fn() };
});

vi.mock('#src/queries/matches/createMatchQueries.js', () => {
  return { createMatch: vi.fn() };
});

describe('closeMatchService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should close bancho channel and update match in database if not already closed', async () => {
    const id = 1;
    const getMatchByIdMock = vi.mocked(getMatchById);
    const banchoChannelFromGameMatchIdSpy = vi.spyOn(
      shared,
      'banchoChannelFromGameMatchId',
    );
    const promiseAllSpy = vi.spyOn(Promise, 'all');
    const match = {
      gameMatchId: 123_456,
      id,
      endsAt: null,
    };

    getMatchByIdMock.mockResolvedValueOnce(match as SelectMatch);

    const { status } = await closeMatchService(id);

    expect(getMatchById).toHaveBeenCalledWith(id, {
      columnsFilter: ['gameMatchId', 'id', 'endsAt'],
    });
    expect(banchoChannelFromGameMatchIdSpy).toHaveBeenCalledWith(
      match.gameMatchId,
    );
    expect(banchoClient.closeMultiplayerChannel).toHaveBeenCalledWith(
      `#mp_${match.gameMatchId}`,
    );
    expect(removeMatchFromCachedSet).toHaveBeenCalledWith(
      `#mp_${match.gameMatchId}`,
    );
    expect(patchMatchById).toHaveBeenCalledWith(
      id,
      expect.objectContaining({ endsAt: expect.any(Date) }),
    );
    expect(promiseAllSpy).toHaveBeenCalled();
    expect(status).toBe('closed');
  });

  it('should throw HttpNotFoundError if match does not exist', async () => {
    const id = 1;
    const getMatchByIdMock = vi.mocked(getMatchById);
    const banchoChannelFromGameMatchIdSpy = vi.spyOn(
      shared,
      'banchoChannelFromGameMatchId',
    );
    const promiseAllSpy = vi.spyOn(Promise, 'all');

    getMatchByIdMock.mockResolvedValueOnce(null);

    try {
      await closeMatchService(id);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpNotFoundError);
      expect(error).toEqual(
        expect.objectContaining({ message: 'Match not found' }),
      );
    }

    expect(getMatchById).toHaveBeenCalledWith(id, {
      columnsFilter: ['gameMatchId', 'id', 'endsAt'],
    });

    expect(banchoChannelFromGameMatchIdSpy).not.toHaveBeenCalled();
    expect(banchoClient.closeMultiplayerChannel).not.toHaveBeenCalled();
    expect(removeMatchFromCachedSet).not.toHaveBeenCalled();
    expect(patchMatchById).not.toHaveBeenCalled();
    expect(promiseAllSpy).not.toHaveBeenCalled();
  });

  it('should throw HttpUnprocessableContentError if match already closed', async () => {
    const id = 1;
    const getMatchByIdMock = vi.mocked(getMatchById);
    const banchoChannelFromGameMatchIdSpy = vi.spyOn(
      shared,
      'banchoChannelFromGameMatchId',
    );
    const promiseAllSpy = vi.spyOn(Promise, 'all');
    const match = {
      gameMatchId: 123_456,
      id,
      endsAt: new Date(),
    };

    getMatchByIdMock.mockResolvedValueOnce(match as SelectMatch);

    try {
      await closeMatchService(id);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpUnprocessableContentError);
      expect(error).toEqual(
        expect.objectContaining({ message: 'Match already closed' }),
      );
    }

    expect(getMatchById).toHaveBeenCalledWith(id, {
      columnsFilter: ['gameMatchId', 'id', 'endsAt'],
    });

    expect(banchoChannelFromGameMatchIdSpy).not.toHaveBeenCalled();
    expect(banchoClient.closeMultiplayerChannel).not.toHaveBeenCalled();
    expect(removeMatchFromCachedSet).not.toHaveBeenCalled();
    expect(patchMatchById).not.toHaveBeenCalled();
    expect(promiseAllSpy).not.toHaveBeenCalled();
  });
});

describe('getMatchService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return match if found', async () => {
    const id = 1;
    const getMatchByIdMock = vi.mocked(getMatchById);
    const match = {
      endsAt: null,
      id,
      name: 'Test Match',
    };

    getMatchByIdMock.mockResolvedValueOnce(match as SelectMatch);

    const result = await getMatchService(id);

    expect(getMatchById).toHaveBeenCalledWith(id, {
      columnsFilter: ['endsAt', 'id', 'name'],
    });
    expect(result).toEqual(match);
  });

  it('should throw HttpNotFoundError if match not found', async () => {
    const id = 1;
    const getMatchByIdMock = vi.mocked(getMatchById);

    getMatchByIdMock.mockResolvedValueOnce(null);

    try {
      await getMatchService(id);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpNotFoundError);
      expect(error).toEqual(
        expect.objectContaining({ message: 'Match not found' }),
      );
    }

    expect(getMatchById).toHaveBeenCalledWith(id, {
      columnsFilter: ['endsAt', 'id', 'name'],
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
    const openMultiplayerChannelMock = vi.mocked(openMultiplayerChannel);
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
      mappoolId: 0,
      name,
      protectsPerTeam: 0,
      startsAt: new Date(),
      tournamentId: 0,
    };

    openMultiplayerChannelMock.mockResolvedValueOnce({ gameMatchId });
    createMatchMock.mockResolvedValueOnce(match as SelectMatch);

    const result = await openMatchService(name);

    expect(openMultiplayerChannel).toHaveBeenCalledWith(name);
    expect(createMatch).toHaveBeenCalledWith({
      bansPerTeam: 0,
      bestOf: 0,
      gameMatchId,
      isQualifierMatch: false,
      mappoolId: 0,
      name,
      protectsPerTeam: 0,
      startsAt: expect.any(Date),
      tournamentId: 0,
    });
    expect(banchoChannelFromGameMatchIdSpy).not.toHaveBeenCalled();
    expect(banchoClient.closeMultiplayerChannel).not.toHaveBeenCalled();
    expect(removeMatchFromCachedSet).not.toHaveBeenCalled();
    expect(promiseAllSpy).not.toHaveBeenCalled();
    expect(result).toEqual(match);
  });

  it('should throw HttpInternalServerError if opening multiplayer channel on bancho fails', async () => {
    const name = 'Test Match';
    const openMultiplayerChannelMock = vi.mocked(openMultiplayerChannel);
    const banchoChannelFromGameMatchIdSpy = vi.spyOn(
      shared,
      'banchoChannelFromGameMatchId',
    );
    const promiseAllSpy = vi.spyOn(Promise, 'all');
    const errorToThrow = new Error('Failed to open channel');

    openMultiplayerChannelMock.mockRejectedValueOnce(errorToThrow);

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

    expect(openMultiplayerChannel).toHaveBeenCalledWith(name);
    expect(createMatch).not.toHaveBeenCalled();
    expect(banchoChannelFromGameMatchIdSpy).not.toHaveBeenCalled();
    expect(banchoClient.closeMultiplayerChannel).not.toHaveBeenCalled();
    expect(removeMatchFromCachedSet).not.toHaveBeenCalled();
    expect(promiseAllSpy).not.toHaveBeenCalled();
  });

  it('should close bancho channel and remove it from cache before throwing HttpInternalServerError if registering match in database fails', async () => {
    const name = 'Test Match';
    const gameMatchId = 123_456;
    const openMultiplayerChannelMock = vi.mocked(openMultiplayerChannel);
    const createMatchMock = vi.mocked(createMatch);
    const banchoChannelFromGameMatchIdSpy = vi.spyOn(
      shared,
      'banchoChannelFromGameMatchId',
    );
    const promiseAllSpy = vi.spyOn(Promise, 'all');
    const errorToThrow = new Error('Failed to create match in database');

    openMultiplayerChannelMock.mockResolvedValueOnce({ gameMatchId });
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

    expect(openMultiplayerChannel).toHaveBeenCalledWith(name);
    expect(createMatch).toHaveBeenCalledWith({
      bansPerTeam: 0,
      bestOf: 0,
      gameMatchId,
      isQualifierMatch: false,
      mappoolId: 0,
      name,
      protectsPerTeam: 0,
      startsAt: expect.any(Date),
      tournamentId: 0,
    });
    expect(banchoChannelFromGameMatchIdSpy).toHaveBeenCalledWith(gameMatchId);
    expect(banchoClient.closeMultiplayerChannel).toHaveBeenCalledWith(
      `#mp_${gameMatchId}`,
    );
    expect(removeMatchFromCachedSet).toHaveBeenCalledWith(`#mp_${gameMatchId}`);
    expect(promiseAllSpy).toHaveBeenCalled();
  });
});
