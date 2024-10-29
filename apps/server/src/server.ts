import express from 'express';
import helmet from 'helmet';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { cache } from '#src/dependencies/cacheDependency.js';
import { postgresClient } from '#src/dependencies/databaseDependency.js';
import { logger } from '#src/dependencies/loggerDependency.js';
import { errorHandler } from '#src/middlewares/errorHandlerMiddleware.js';
import { setRequestId } from '#src/middlewares/requestIdentityMiddleware.js';
import { ressourceNotFoundHandler } from '#src/middlewares/ressourceNotFoundMiddleware.js';
import { session } from '#src/middlewares/sessionMiddleware.js';
import { specificationValidator } from '#src/middlewares/specificationValidatorMiddleware.js';
import { apiRouter } from '#src/routes/apiRouter.js';

const app = express();

app.use(helmet());
app.set('trust proxy', 1);

app.use(setRequestId);
app.use(express.json());
app.use(session);

app.use(specificationValidator);

app.use('/api', apiRouter);
app.use(ressourceNotFoundHandler);
app.use(errorHandler);

const server = app.listen(environmentConfig.expressPort, () => {
  logger.info('Server is running...');
});

const cleanup = () => {
  logger.debug('shutting down server...');
  server.close(async (error) => {
    if (error) {
      return;
    }

    logger.debug('close chache and database connections...');
    await cache.quit();
    await postgresClient.end();
  });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
