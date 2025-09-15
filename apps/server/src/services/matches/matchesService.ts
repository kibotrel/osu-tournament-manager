import {
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

export const openMatch = async (name: string) => {
  const { gameMatchId } = await openMultiplayerChannel(name);

  try {
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
    const channel = banchoChannelFromGameMatchId(gameMatchId);
    const promises = [
      banchoClient.closeMultiplayerChannel(channel),
      removeMatchFromCachedSet(channel),
    ];

    await Promise.all(promises);

    throw error;
  }
};

export const closeMatch = async (id: number) => {
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
