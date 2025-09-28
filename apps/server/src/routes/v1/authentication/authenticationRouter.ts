import type { Router } from 'express';
import express from 'express';

import { loginController } from '#src/controllers/v1/authentication/loginController.js';
import { logoutController } from '#src/controllers/v1/authentication/logoutController.js';
import { validateRequest } from '#src/middlewares/requestValidatorMiddleware.js';
import { loginValidators } from '#src/validators/v1/authentication/loginValidators.js';

const authenticationRouter: Router = express.Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

authenticationRouter.post(
  '/login',
  loginValidators(),
  validateRequest,
  loginController,
);
authenticationRouter.get('/logout', logoutController);

export { authenticationRouter };
