import type { Router } from 'express';
import express from 'express';

import { getHealthController } from '#src/controllers/v1/public/getHealthController.js';
import { getLogoutController } from '#src/controllers/v1/public/getLogoutController.js';
import { postLoginController } from '#src/controllers/v1/public/postLoginController.js';
import { validateRequest } from '#src/middlewares/requestValidatorMiddleware.js';
import { postLoginValidators } from '#src/validators/v1/public/postLoginValidators.js';

const publicRouter: Router = express.Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

publicRouter.get('/health', getHealthController);
publicRouter.post(
  '/login',
  postLoginValidators(),
  validateRequest,
  postLoginController,
);
publicRouter.get('/logout', getLogoutController);

export { publicRouter };
