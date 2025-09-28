import {
  HttpInternalServerError,
  HttpNotFoundError,
  HttpUnprocessableContentError,
  banchoChannelFromGameMatchId,
} from '@packages/shared';

import { banchoClient } from '#src/dependencies/ircClientDependency.js';
import { createMatch } from '#src/queries/matches/createMatchQueries.js';
import { getMatchById } from '#src/queries/matches/getMatchQueries.js';
import { patchMatchById } from '#src/queries/matches/updateMatchQueries.js';
import { openMultiplayerChannel } from '#src/services/bancho/multiplayerService.js';
import { removeMatchFromCachedSet } from '#src/services/cache/cacheService.js';

export const closeMatchService = async (id: number) => {
  const match = await getMatchById(id, {
    columnsFilter: ['gameMatchId', 'id', 'endsAt'],
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
  const promises = [
    banchoClient.closeMultiplayerChannel(channel),
    removeMatchFromCachedSet(channel),
    patchMatchById(id, { endsAt: new Date() }),
  ];

  await Promise.all(promises);

  // TODO: implement detection about wether or nor the match was actually played, cancelled, forfeited etc.
  return { status: 'closed' as const };
};

export const getMatchService = async (id: number) => {
  const match = await getMatchById(id, {
    columnsFilter: ['endsAt', 'id', 'name'],
  });

  if (!match) {
    throw new HttpNotFoundError({ message: 'Match not found' });
  }

  return match;
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
      mappoolId: 0,
      name,
      protectsPerTeam: 0,
      startsAt: new Date(),
      tournamentId: 0,
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
