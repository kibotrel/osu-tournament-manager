import type { Express } from 'express';
import express from 'express';
import helmet from 'helmet';

import { errorHandler } from '#src/middlewares/errorHandler.middleware.js';
import { logHttpRequest } from '#src/middlewares/logHttpRequest.middleware.js';
import { setRequestId } from '#src/middlewares/requestIdentity.middleware.js';
import { resourceNotFoundHandler } from '#src/middlewares/resourceNotFound.middleware.js';
import { session } from '#src/middlewares/session.middleware.js';
import { specificationValidator } from '#src/middlewares/specificationValidator.middleware.js';
import { apiRouter } from '#src/routes/api.router.js';

export const createExpressApplication = (): Express => {
  const application = express();

  application.use(helmet());
  application.set('trust proxy', 1);

  application.use(express.json());
  application.use(setRequestId);
  application.use(logHttpRequest);
  application.use(session);

  application.use('/api', apiRouter);
  application.use(specificationValidator);

  application.use(resourceNotFoundHandler);
  application.use(errorHandler);

  return application;
};
