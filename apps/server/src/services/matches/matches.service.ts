import type {
  HttpError,
  WebSocketMatchMessage,
  WebSocketMessage,
} from '@packages/shared';
import {
  HttpInternalServerError,
  HttpNotFoundError,
  HttpUnprocessableContentError,
  banchoChannelFromGameMatchId,
} from '@packages/shared';

import { baseMatchState } from '#src/constants/bancho.constants.js';
import { banchoClient } from '#src/dependencies/ircClient.dependency.js';
import { logger } from '#src/dependencies/logger.dependency.js';
import { createMatch } from '#src/queries/matches/matches.create.queries.js';
import { getMatchByGameMatchId } from '#src/queries/matches/matches.get.queries.js';
import { openMultiplayerChannelService } from '#src/services/bancho/bancho.multiplayer.service.js';
import {
  getMatchChatHistoryFromCacheService,
  getMatchStateFromCacheService,
  removeMatchFromCachedSetService,
} from '#src/services/cache/cache.service.js';

export const closeMatchService = async (gameMatchId: number) => {
  const match = await getMatchByGameMatchId(gameMatchId, {
    columnsFilter: ['endsAt', 'gameMatchId', 'gameMatchId', 'id'],
  });

  if (!match) {
    throw new HttpNotFoundError({ message: 'Match not found' });
  }

  if (match.endsAt) {
    throw new HttpUnprocessableContentError({
      message: 'Match already closed',
    });
  }

  const channel = banchoChannelFromGameMatchId(match.gameMatchId);

  try {
    await banchoClient.closeMultiplayerChannel(channel);
  } catch (error) {
    logger.warn(`Failed to close channel #mp-${gameMatchId}`, {
      error: error as HttpError,
    });
  }

  // TODO: implement detection about wether or nor the match was actually played, cancelled, forfeited etc.
  return { status: 'closed' as const };
};

export const getMatchService = async (gameMatchId: number) => {
  const match = await getMatchByGameMatchId(gameMatchId, {
    columnsFilter: ['endsAt', 'gameMatchId', 'name'],
  });

  if (!match) {
    throw new HttpNotFoundError({ message: 'Match not found' });
  }

  return match;
};

export const getMatchChatHistoryService = async (
  gameMatchId: number | string,
) => {
  const cacheHistory = await getMatchChatHistoryFromCacheService(gameMatchId);

  return cacheHistory.map<WebSocketMessage<WebSocketMatchMessage>>((entry) => {
    return JSON.parse(entry);
  });
};

export const getMatchStateService = async (gameMatchId: number | string) => {
  const state = await getMatchStateFromCacheService(gameMatchId);

  if (!state) {
    return baseMatchState;
  }

  return state;
};

export const openMatchService = async (name: string) => {
  let matchId: number = 0;

  try {
    const { gameMatchId } = await openMultiplayerChannelService(name);

    matchId = gameMatchId;

    // TODO: Fill with real data when creating tournament, mappools and teams are implemented.
    return await createMatch({
      bansPerTeam: 0,
      bestOf: 0,
      gameMatchId,
      isQualifierMatch: false,
      mappoolId: 1,
      name,
      protectsPerTeam: 0,
      startsAt: new Date(),
      tournamentId: 1,
    });
  } catch (error) {
    const usableError =
      error instanceof Error ? error : new Error(String(error));

    if (!matchId) {
      throw new HttpInternalServerError({
        cause: usableError,
        message: 'Failed to open bancho multiplayer channel',
        metadata: { name },
      });
    }

    const channel = banchoChannelFromGameMatchId(matchId);
    const promises = [
      banchoClient.closeMultiplayerChannel(channel),
      removeMatchFromCachedSetService(channel),
    ];

    await Promise.all(promises);

    throw new HttpInternalServerError({
      cause: usableError,
      message: 'Failed to create match in database',
      metadata: { name, gameMatchId: matchId },
    });
  }
};
