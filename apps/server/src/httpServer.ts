import type { Server } from 'node:http';

import {
  BanchoClientEvent,
  BanchoPublicChannel,
} from '@packages/bancho-client';

import { createExpressApplication } from '#src/application.js';
import type { WebSocketServer } from '#src/classes/webSocketServer.class.js';
import { environmentConfig } from '#src/configs/environment.config.js';
import { cache } from '#src/dependencies/cache.dependency.js';
import { postgresClient } from '#src/dependencies/database.dependency.js';
import { banchoClient } from '#src/dependencies/ircClient.dependency.js';
import { logger } from '#src/dependencies/logger.dependency.js';

export const gracefulShutdown = async (
  httpServer: Server,
  webSocketServer: WebSocketServer,
) => {
  await webSocketServer.close();
  await banchoClient.removeAllListeners(BanchoClientEvent.BotDisconnected);

  banchoClient.on(BanchoClientEvent.BotDisconnected, () => {
    logger.debug('[IRC] Disconnected from osu! server');
  });

  await banchoClient.disconnect();

  httpServer.close(async (error) => {
    if (error) {
      return;
    }

    await cache.close();
    await postgresClient.end();
    logger.end();
  });
};

export const createHttpServer = async () => {
  const application = createExpressApplication();

  await banchoClient.connect();
  await banchoClient.joinChannel(BanchoPublicChannel.Lobby);

  return application.listen(environmentConfig.expressPort, () => {
    logger.debug('HTTP Server is running...');
  });
};
