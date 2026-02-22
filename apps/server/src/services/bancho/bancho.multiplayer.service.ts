import { gameMatchIdFromBanchoChannel } from '@packages/shared';

import { banchoClient } from '#src/dependencies/ircClient.dependency.js';
import {
  addMatchToCachedSetService,
  getAllOngoingMatchesFromCacheService,
  removeMatchFromCachedSetService,
} from '#src/services/cache/cache.service.js';

export const openMultiplayerChannelService = async (name: string) => {
  const channel = await banchoClient.createMultiplayerChannel(name);

  await addMatchToCachedSetService(channel);

  return { gameMatchId: gameMatchIdFromBanchoChannel(channel) };
};

export const joinAllOngoingMatchesService = async () => {
  const ongoingMatches = await getAllOngoingMatchesFromCacheService();

  if (ongoingMatches.length === 0) {
    return;
  }

  const promises = ongoingMatches.map(async (channel) => {
    try {
      await banchoClient.joinChannel(channel);
    } catch {
      await removeMatchFromCachedSetService(channel);
    }
  });

  await Promise.all(promises);
};
