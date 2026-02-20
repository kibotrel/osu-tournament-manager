import { Router } from 'express';

import { healthController } from '#src/controllers/v1/public/public.health.controller.js';

const publicRouter: Router = Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

publicRouter.get('/health', healthController);

export { publicRouter };
