import type { Router } from 'express';
import express from 'express';

import { closeMatchController } from '#src/controllers/v1/matches/closeMatchController.js';
import { createMatchController } from '#src/controllers/v1/matches/createMatchController.js';
import { getMatchChatHistoryController } from '#src/controllers/v1/matches/getMatchChatHistoryController.js';
import { getMatchController } from '#src/controllers/v1/matches/getMatchController.js';
import { getMatchStateHistoryController } from '#src/controllers/v1/matches/getMatchStateController.js';
import { validateRequest } from '#src/middlewares/requestValidatorMiddleware.js';
import { isAuthenticated } from '#src/middlewares/sessionMiddleware.js';
import { closeMatchValidators } from '#src/validators/v1/matches/closeMatchValidators.js';
import { createMatchValidators } from '#src/validators/v1/matches/createMatchValidators.js';
import { getMatchChatHistoryValidators } from '#src/validators/v1/matches/getMatchChatHistoryValidators.js';
import { getMatchStateValidators } from '#src/validators/v1/matches/getMatchStateValidators.js';
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
matchesRouter.get(
  '/:gameMatchId/chat-history',
  getMatchChatHistoryValidators(),
  validateRequest,
  getMatchChatHistoryController,
);
matchesRouter.get(
  '/:gameMatchId/state',
  getMatchStateValidators(),
  validateRequest,
  getMatchStateHistoryController,
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
