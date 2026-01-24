import { gameMatchIdFromBanchoChannel } from '@packages/shared';

import { logger } from '#src/dependencies/loggerDependency.js';
import {
  deleteMatchChatHistoryFromCache,
  deleteMatchStateFromCache,
  removeMatchFromCachedSet,
} from '#src/services/cache/cacheService.js';

export const onMultiplayerChannelClosed = async ({
  channel,
}: {
  channel: string;
}) => {
  logger.debug(`[IRC] Match ${channel} closed`);

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const promises = [
    deleteMatchChatHistoryFromCache(channelId),
    deleteMatchStateFromCache(channelId),
    removeMatchFromCachedSet(channel),
  ];

  await Promise.all(promises);

  // TODO: investigate if we need to broadcast a message to clients here
};
