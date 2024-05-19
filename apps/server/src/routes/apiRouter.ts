import type { Router } from 'express';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { documentation } from '#src/middlewares/documentationMiddleware.js';
import { v1Router } from '#src/routes/v1/v1Router.js';

const apiRouter: Router = express.Router({ caseSensitive: true, strict: true });

apiRouter.use('/documentation', swaggerUi.serve, documentation);
apiRouter.use('/v1', v1Router);

export { apiRouter };
