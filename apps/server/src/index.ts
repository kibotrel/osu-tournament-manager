import express from 'express';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { errorHandler } from '#src/middlewares/errorHandlerMiddleware.js';
import { ressourceNotFoundHandler } from '#src/middlewares/ressourceNotFoundMiddleware.js';
import { specificationValidator } from '#src/middlewares/specificationValidatorMiddleware.js';
import { apiRouter } from '#src/routes/apiRouter.js';

const server = express();

server.set('trust proxy', 1);
server.disable('x-powered-by');
server.use(express.json());

server.use(specificationValidator);

server.use('/api', apiRouter);
server.use(ressourceNotFoundHandler);
server.use(errorHandler);

server.listen(environmentConfig.expressPort, () => {
  console.log(`Server is running on port ${environmentConfig.expressPort}`);
});
