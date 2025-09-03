import type { Express } from 'express';
import express from 'express';
import helmet from 'helmet';

import { errorHandler } from '#src/middlewares/errorHandlerMiddleware.js';
import { logHttpRequest } from '#src/middlewares/logHttpRequestMiddleware.js';
import { setRequestId } from '#src/middlewares/requestIdentityMiddleware.js';
import { resourceNotFoundHandler } from '#src/middlewares/resourceNotFoundMiddleware.js';
import { session } from '#src/middlewares/sessionMiddleware.js';
import { specificationValidator } from '#src/middlewares/specificationValidatorMiddleware.js';
import { apiRouter } from '#src/routes/apiRouter.js';

export const createExpressApplication = (): Express => {
  const application = express();

  application.use(helmet());
  application.set('trust proxy', 1);

  application.use(setRequestId);
  application.use(express.json());
  application.use(logHttpRequest);
  application.use(session);

  application.use(specificationValidator);

  application.use('/api', apiRouter);
  application.use(resourceNotFoundHandler);
  application.use(errorHandler);

  return application;
};
