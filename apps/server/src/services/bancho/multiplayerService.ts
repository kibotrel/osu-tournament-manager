import { gameMatchIdFromBanchoChannel } from '@packages/shared';

import { banchoClient } from '#src/dependencies/ircClientDependency.js';
import { logger } from '#src/dependencies/loggerDependency.js';
import {
  addMatchToCachedSet,
  getAllOngoingMatchesFromCache,
  removeMatchFromCachedSet,
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

  const promises = ongoingMatches.map(async (channel) => {
    try {
      await banchoClient.joinChannel(channel);
    } catch {
      await removeMatchFromCachedSet(channel);
    }
  });

  await Promise.all(promises);
};

export const closeExpiredMultiplayerChannel = async ({
  channel,
}: {
  channel: string;
}) => {
  logger.debug(`[IRC] Match ${channel} closed.`);

  await removeMatchFromCachedSet(channel);

  // TODO: investigate if we need to broadcast a message to clients here
};
