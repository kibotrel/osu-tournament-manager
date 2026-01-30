import { Router } from 'express';

import { healthController } from '#src/controllers/v1/public/healthController.js';

const publicRouter: Router = Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

publicRouter.get('/health', healthController);

export { publicRouter };
