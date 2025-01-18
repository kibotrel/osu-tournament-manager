import type { Server } from 'node:http';

import { createExpressApplication } from '#src/application.js';
import { environmentConfig } from '#src/configs/environmentConfig.js';
import { cache } from '#src/dependencies/cacheDependency.js';
import { postgresClient } from '#src/dependencies/databaseDependency.js';
import { logger } from '#src/dependencies/loggerDependency.js';

export const gracefulShutdown = (server: Server) => {
  logger.debug('shutting down server...');

  server.close(async (error) => {
    if (error) {
      return;
    }

    await logger.debug('close chache and database connections...');
    await logger.end();
    await cache.quit();
    await postgresClient.end();
  });
};

export const createHttpServer = () => {
  const application = createExpressApplication();

  return application.listen(environmentConfig.expressPort, () => {
    logger.info('Server is running...');
  });
};
