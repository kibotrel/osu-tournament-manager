import type { Router } from 'express';
import express from 'express';

import { closeMatchController } from '#src/controllers/v1/matches/closeMatchController.js';
import { createMatchController } from '#src/controllers/v1/matches/createMatchController.js';
import { getMatchController } from '#src/controllers/v1/matches/getMatchController.js';
import { validateRequest } from '#src/middlewares/requestValidatorMiddleware.js';
import { isAuthenticated } from '#src/middlewares/sessionMiddleware.js';
import { closeMatchValidators } from '#src/validators/v1/matches/closeMatchValidators.js';
import { createMatchValidators } from '#src/validators/v1/matches/createMatchValidators.js';
import { getMatchValidators } from '#src/validators/v1/matches/getMatchValidators.js';

const matchesRouter: Router = express.Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

matchesRouter.use(isAuthenticated);
matchesRouter.post(
  '/',
  createMatchValidators(),
  validateRequest,
  createMatchController,
);
matchesRouter.post(
  '/:gameMatchId/close',
  closeMatchValidators(),
  validateRequest,
  closeMatchController,
);
matchesRouter.get(
  '/:gameMatchId',
  getMatchValidators(),
  validateRequest,
  getMatchController,
);

export { matchesRouter };
