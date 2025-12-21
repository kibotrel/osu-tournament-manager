import { BanchoPublicChannel } from '@packages/bancho-client';
import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  type WebSocketMatchMessage,
  type WebSocketMessage,
  gameMatchIdFromBanchoChannel,
} from '@packages/shared';

// import { logger } from '#src/dependencies/loggerDependency.js';
import { logger } from '#src/dependencies/loggerDependency.js';
import { webSocketServer } from '#src/websocketServer.js';

export const broadcastBanchoMessage = ({
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

  logger.silly(`[IRC] New message in ${channel}`, {
    content: message,
    user,
  });

  const payload: WebSocketMessage<WebSocketMatchMessage> = {
    message: { author: user, content: message },
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${gameMatchIdFromBanchoChannel(channel)}:${WebSocketChannelMatchesEvent.ChatMessages}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
};
