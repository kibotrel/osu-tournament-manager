import type { Server } from 'node:http';

import { BanchoPublicChannel } from '@packages/bancho-client';

import { createExpressApplication } from '#src/application.js';
import type { WebSocketServer } from '#src/classes/webSocketServerClass.js';
import { environmentConfig } from '#src/configs/environmentConfig.js';
import { cache } from '#src/dependencies/cacheDependency.js';
import { postgresClient } from '#src/dependencies/databaseDependency.js';
import { banchoClient } from '#src/dependencies/ircClientDependency.js';
import { logger } from '#src/dependencies/loggerDependency.js';

export const gracefulShutdown = async (
  httpServer: Server,
  webSocketServer: WebSocketServer,
) => {
  await webSocketServer.close();
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
