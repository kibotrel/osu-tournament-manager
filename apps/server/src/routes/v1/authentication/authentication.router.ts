import { Router } from 'express';

import { loginController } from '#src/controllers/v1/authentication/authentication.login.controller.js';
import { logoutController } from '#src/controllers/v1/authentication/authentication.logout.controller.js';
import { validateRequest } from '#src/middlewares/requestValidator.middleware.js';
import { loginValidators } from '#src/validators/v1/authentication/authentication.login.validators.js';

const authenticationRouter: Router = Router({
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
