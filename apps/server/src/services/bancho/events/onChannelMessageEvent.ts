import { BanchoPublicChannel } from '@packages/bancho-client';
import type { WebSocketMatchMessage, WebSocketMessage } from '@packages/shared';
import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  gameMatchIdFromBanchoChannel,
} from '@packages/shared';

import { logger } from '#src/dependencies/loggerDependency.js';
import { addMatchMessageToCache } from '#src/services/cache/cacheService.js';
import { webSocketServer } from '#src/websocketServer.js';

export const onChannelMessage = async ({
  channel,
  message,
  user,
}: {
  channel: string;
  message: string;
  user: string;
}) => {
  if (channel === BanchoPublicChannel.Lobby || !channel.startsWith('#')) {
    return;
  }

  logger.debug(`[IRC] New message in ${channel}`, {
    content: message,
    user,
  });

  const gameMatchId = gameMatchIdFromBanchoChannel(channel);
  const payload: WebSocketMessage<WebSocketMatchMessage> = {
    message: { author: user, content: message },
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${gameMatchId}:${WebSocketChannelMatchesEvent.ChatMessages}`,
  };
  const buffer = Buffer.from(JSON.stringify(payload));

  await addMatchMessageToCache({
    channel: gameMatchId,
    message: buffer.toString(),
  });
  webSocketServer.broadcastMessageToSubscribers(buffer, {
    isBinary: false,
    isBanchoMessage: true,
  });
};
