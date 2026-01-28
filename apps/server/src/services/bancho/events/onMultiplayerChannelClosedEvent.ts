import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  gameMatchIdFromBanchoChannel,
} from '@packages/shared';

import { logger } from '#src/dependencies/loggerDependency.js';
import { patchMatchByGameMatchId } from '#src/queries/matches/updateMatchQueries.js';
import {
  deleteMatchChatHistoryFromCache,
  deleteMatchStateFromCache,
  removeMatchFromCachedSet,
} from '#src/services/cache/cacheService.js';
import { webSocketServer } from '#src/websocketServer.js';

export const onMultiplayerChannelClosed = async ({
  channel,
}: {
  channel: string;
}) => {
  logger.debug(`[IRC] channel ${channel} closed`);

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const promises = [
    deleteMatchChatHistoryFromCache(channelId),
    deleteMatchStateFromCache(channelId),
    patchMatchByGameMatchId(channelId, { endsAt: new Date() }),
    removeMatchFromCachedSet(channel),
    webSocketServer.disconnectAllTopicSubscribers(
      `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.ChatMessages}`,
    ),
    webSocketServer.disconnectAllTopicSubscribers(
      `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
    ),
  ];

  await Promise.all(promises);
};
