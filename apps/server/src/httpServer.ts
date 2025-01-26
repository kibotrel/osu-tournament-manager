import type { Server } from 'node:http';

import { createExpressApplication } from '#src/application.js';
import type { WebSocketServer } from '#src/classes/webSocketServerClass.js';
import { environmentConfig } from '#src/configs/environmentConfig.js';
import { cache } from '#src/dependencies/cacheDependency.js';
import { postgresClient } from '#src/dependencies/databaseDependency.js';
import { logger } from '#src/dependencies/loggerDependency.js';

export const gracefulShutdown = async (
  httpServer: Server,
  webSocketServer: WebSocketServer,
) => {
  logger.debug('shutting down server...');

  await webSocketServer.close();

  httpServer.close(async (error) => {
    if (error) {
      return;
    }

    await logger.end();
    await cache.quit();
    await postgresClient.end();
  });
};

export const createHttpServer = () => {
  const application = createExpressApplication();

  return application.listen(environmentConfig.expressPort, async () => {
    await logger.info('Server is running...');
  });
};
