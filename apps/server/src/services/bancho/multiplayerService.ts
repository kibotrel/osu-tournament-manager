import { gameMatchIdFromBanchoChannel } from '@packages/shared';

import { banchoClient } from '#src/dependencies/ircClientDependency.js';
import {
  addMatchToCachedSet,
  getAllOngoingMatchesFromCache,
} from '#src/services/cache/cacheService.js';

export const openMultiplayerChannel = async (name: string) => {
  const channel = await banchoClient.createMultiplayerChannel(name);

  await addMatchToCachedSet(channel);

  return { gameMatchId: gameMatchIdFromBanchoChannel(channel) };
};

export const joinAllOngoingMatches = async () => {
  const ongoingMatches = await getAllOngoingMatchesFromCache();

  if (ongoingMatches.length === 0) {
    return;
  }

  const promises = ongoingMatches.map((channel) => {
    banchoClient.joinChannel(channel);
  });

  await Promise.all(promises);
};
