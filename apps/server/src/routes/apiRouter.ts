import type { Router } from 'express';
import express from 'express';

import { v1Router } from '#src/routes/v1/v1Router.js';

const apiRouter: Router = express.Router({ caseSensitive: true, strict: true });

apiRouter.use('/v1', v1Router);

export { apiRouter };
