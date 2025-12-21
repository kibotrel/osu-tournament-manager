import type { WebSocketMatchMessage, WebSocketMessage } from '@packages/shared';
import {
  HttpInternalServerError,
  HttpNotFoundError,
  HttpUnprocessableContentError,
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  banchoChannelFromGameMatchId,
} from '@packages/shared';

import { banchoClient } from '#src/dependencies/ircClientDependency.js';
import { createMatch } from '#src/queries/matches/createMatchQueries.js';
import { getMatchByGameMatchId } from '#src/queries/matches/getMatchQueries.js';
import { patchMatchById } from '#src/queries/matches/updateMatchQueries.js';
import { openMultiplayerChannel } from '#src/services/bancho/multiplayerService.js';
import {
  deleteMatchChatHistoryFromCache,
  getMatchChatHistoryFromCache,
  removeMatchFromCachedSet,
} from '#src/services/cache/cacheService.js';
import { webSocketServer } from '#src/websocketServer.js';

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

  await banchoClient.closeMultiplayerChannel(channel);

  const promises = [
    removeMatchFromCachedSet(channel),
    deleteMatchChatHistoryFromCache(match.gameMatchId),
    patchMatchById(match.id, { endsAt: new Date() }),
    webSocketServer.disconnectAllTopicSubscribers(
      `${WebSocketChannel.Matches}:${match.gameMatchId}:${WebSocketChannelMatchesEvent.ChatMessages}`,
    ),
  ];

  await Promise.all(promises);

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
  const cacheHistory = await getMatchChatHistoryFromCache(gameMatchId);

  return cacheHistory.map<WebSocketMessage<WebSocketMatchMessage>>((entry) => {
    return JSON.parse(entry);
  });
};

export const openMatchService = async (name: string) => {
  let matchId: number = 0;

  try {
    const { gameMatchId } = await openMultiplayerChannel(name);

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
      removeMatchFromCachedSet(channel),
    ];

    await Promise.all(promises);

    throw new HttpInternalServerError({
      cause: usableError,
      message: 'Failed to create match in database',
      metadata: { name, gameMatchId: matchId },
    });
  }
};
