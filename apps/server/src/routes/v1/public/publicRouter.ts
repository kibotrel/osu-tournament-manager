import type { Router } from 'express';
import express from 'express';

import { getHealthController } from '#src/controllers/v1/public/getHealthController.js';

const publicRouter: Router = express.Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

publicRouter.get('/health', getHealthController);

export { publicRouter };
