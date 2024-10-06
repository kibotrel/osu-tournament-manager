import express from 'express';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { errorHandler } from '#src/middlewares/errorHandlerMiddleware.js';
import { ressourceNotFoundHandler } from '#src/middlewares/ressourceNotFoundMiddleware.js';
import { session } from '#src/middlewares/sessionMiddleware.js';
import { specificationValidator } from '#src/middlewares/specificationValidatorMiddleware.js';
import { apiRouter } from '#src/routes/apiRouter.js';

import { cache } from './dependencies/cacheDependency.js';
import { postgresClient } from './dependencies/databaseDependency.js';

declare module 'express-session' {
  interface SessionData {
    user: {
      gameUserId: number;
      id: number;
      osuApiToken: string;
    };
  }
}

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(express.json());
app.use(session);

app.use(specificationValidator);

app.use('/api', apiRouter);
app.use(ressourceNotFoundHandler);
app.use(errorHandler);

const server = app.listen(environmentConfig.expressPort, () => {
  console.log(`Server is running on port ${environmentConfig.expressPort}`);
});

const cleanup = () => {
  server.close(async (error) => {
    if (error) {
      return;
    }

    await cache.quit();
    await postgresClient.end();
  });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
