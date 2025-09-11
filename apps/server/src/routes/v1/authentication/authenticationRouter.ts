import type { Router } from 'express';
import express from 'express';

import { getLogoutController } from '#src/controllers/v1/authentication/getLogoutController.js';
import { postLoginController } from '#src/controllers/v1/authentication/postLoginController.js';
import { validateRequest } from '#src/middlewares/requestValidatorMiddleware.js';
import { postLoginValidators } from '#src/validators/v1/public/postLoginValidators.js';

const authenticationRouter: Router = express.Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

authenticationRouter.post(
  '/login',
  postLoginValidators(),
  validateRequest,
  postLoginController,
);
authenticationRouter.get('/logout', getLogoutController);

export { authenticationRouter };
