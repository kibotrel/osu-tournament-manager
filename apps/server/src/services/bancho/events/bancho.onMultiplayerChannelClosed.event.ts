import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  gameMatchIdFromBanchoChannel,
} from '@packages/shared';

import { logger } from '#src/dependencies/logger.dependency.js';
import { patchMatchByGameMatchId } from '#src/queries/matches/matches.update.queries.js';
import {
  deleteMatchChatHistoryFromCacheService,
  deleteMatchStateFromCacheService,
  removeMatchFromCachedSetService,
} from '#src/services/cache/cache.service.js';
import { webSocketServer } from '#src/websocketServer.js';

export const onMultiplayerChannelClosed = async ({
  channel,
}: {
  channel: string;
}) => {
  logger.debug(`[IRC] channel ${channel} closed`);

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const promises = [
    deleteMatchChatHistoryFromCacheService(channelId),
    deleteMatchStateFromCacheService(channelId),
    patchMatchByGameMatchId(channelId, { endsAt: new Date() }),
    removeMatchFromCachedSetService(channel),
    webSocketServer.disconnectAllTopicSubscribers(
      `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.ChatMessages}`,
    ),
    webSocketServer.disconnectAllTopicSubscribers(
      `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
    ),
  ];

  await Promise.all(promises);
};
