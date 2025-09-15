import { banchoChannelFromGameMatchId } from '@packages/shared';

import { banchoClient } from '#src/dependencies/ircClientDependency.js';
import { createMatch } from '#src/queries/matches/createMatchQueries.js';
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
