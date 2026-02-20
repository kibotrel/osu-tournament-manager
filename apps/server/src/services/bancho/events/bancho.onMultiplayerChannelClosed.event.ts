import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  gameMatchIdFromBanchoChannel,
} from '@packages/shared';

import { logger } from '#src/dependencies/logger.dependency.js';
import { patchMatchByGameMatchId } from '#src/queries/matches/matches.update.queries.js';
import {
  deleteMatchChatHistoryFromCache,
  deleteMatchStateFromCache,
  removeMatchFromCachedSet,
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
