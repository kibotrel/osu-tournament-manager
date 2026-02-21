import type { Express } from 'express';
import express from 'express';
import helmet from 'helmet';

import { errorMiddleware } from '#src/middlewares/errorHandler.middleware.js';
import { logHttpRequestMiddleware } from '#src/middlewares/logHttpRequest.middleware.js';
import { setRequestIdMiddleware } from '#src/middlewares/requestIdentity.middleware.js';
import { resourceNotFoundMiddleware } from '#src/middlewares/resourceNotFound.middleware.js';
import { sessionMiddleware } from '#src/middlewares/session.middleware.js';
import { specificationValidatorMiddleware } from '#src/middlewares/specificationValidator.middleware.js';
import { apiRouter } from '#src/routes/api.router.js';

export const createExpressApplication = (): Express => {
  const application = express();

  application.use(helmet());
  application.set('trust proxy', 1);

  application.use(express.json());
  application.use(setRequestIdMiddleware);
  application.use(logHttpRequestMiddleware);
  application.use(sessionMiddleware);

  application.use('/api', apiRouter);
  application.use(specificationValidatorMiddleware);

  application.use(resourceNotFoundMiddleware);
  application.use(errorMiddleware);

  return application;
};
