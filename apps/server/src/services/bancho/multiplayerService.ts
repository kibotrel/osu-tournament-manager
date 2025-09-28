import { banchoClient } from '#src/dependencies/ircClientDependency.js';
import {
  addMatchToCachedSet,
  getAllOngoingMatchesFromCache,
} from '#src/services/cache/cacheService.js';

export const openMultiplayerChannel = async (name: string) => {
  const channel = await banchoClient.createMultiplayerChannel(name);

  await addMatchToCachedSet(channel);

  /**
   * The channel returned by the IRC server is in the format #mp_<channelId>.
   * Handling channelId throughout the application is easier.
   */
  const gameMatchId = channel.slice(4);

  return { gameMatchId: Number(gameMatchId) };
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
