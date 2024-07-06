import type { Router } from 'express';
import express from 'express';

import { getHealthController } from '#src/controllers/v1/public/getHealthController.js';
import { getLogoutController } from '#src/controllers/v1/public/getLogoutController.js';
import { postOauthController } from '#src/controllers/v1/public/postOauthController.js';

const publicRouter: Router = express.Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

publicRouter.get('/health', getHealthController);
publicRouter.get('/logout', getLogoutController);
publicRouter.post('/oauth', postOauthController);

export { publicRouter };
