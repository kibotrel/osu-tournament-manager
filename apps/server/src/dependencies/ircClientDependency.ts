import {
  BanchoClient,
  BanchoClientEvent,
  BanchoPublicChannel,
} from '@packages/bancho-client';
import type { WebSocketMessage, WebSocketMessageMatch } from '@packages/shared';
import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  gameMatchIdFromBanchoChannel,
} from '@packages/shared';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { logger } from '#src/dependencies/loggerDependency.js';
import { removeMatchFromCachedSet } from '#src/services/cache/cacheService.js';
import { webSocketServer } from '#src/websocketServer.js';

const banchoClient = new BanchoClient({
  clientCredentials: {
    username: environmentConfig.osuIrcClientUsername,
    password: environmentConfig.osuIrcClientPassword,
  },
  serverInformation: {
    host: environmentConfig.osuIrcServerHostname,
    port: environmentConfig.osuIrcServerPort,
  },
});

banchoClient.on(BanchoClientEvent.BotConnected, () => {
  logger.debug('[IRC] Connected to the osu! server.');
});

banchoClient.on(BanchoClientEvent.BotDisconnected, async () => {
  logger.debug('[IRC] Disconnected from osu! server');

  await banchoClient.connect();
});

banchoClient.on(BanchoClientEvent.BotJoinedChannel, ({ channel }) => {
  logger.debug(`[IRC] Joined ${channel}.`);
});

banchoClient.on(
  BanchoClientEvent.ChannelMessage,
  ({ channel, message, user }) => {
    if (channel === BanchoPublicChannel.Lobby || !channel.startsWith('#')) {
      return;
    }

    logger.debug(`[IRC] New message in ${channel}`, {
      content: message,
      user,
    });

    const payload: WebSocketMessage<WebSocketMessageMatch> = {
      message: { author: user, content: message },
      timestamp: Date.now(),
      topic: `${WebSocketChannel.Matches}:${gameMatchIdFromBanchoChannel(channel)}:${WebSocketChannelMatchesEvent.ChatMessages}`,
    };

    webSocketServer.broadcastMessageToSubscribers(
      Buffer.from(JSON.stringify(payload)),
      { isBinary: false, isBanchoMessage: true },
    );
  },
);

banchoClient.on(
  BanchoClientEvent.MultiplayerChannelClosed,
  async ({ channel }) => {
    logger.debug(`[IRC] Match ${channel} closed.`);

    await removeMatchFromCachedSet(channel);
  },
);

export { banchoClient };
