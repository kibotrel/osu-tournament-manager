import { Router } from 'express';

import { closeMatchController } from '#src/controllers/v1/matches/matches.close.controller.js';
import { createMatchController } from '#src/controllers/v1/matches/matches.create.controller.js';
import { getMatchController } from '#src/controllers/v1/matches/matches.get.controller.js';
import { getMatchChatHistoryController } from '#src/controllers/v1/matches/matches.getChatHistory.controller.js';
import { getMatchStateController } from '#src/controllers/v1/matches/matches.getState.controller.js';
import { validateRequest } from '#src/middlewares/requestValidator.middleware.js';
import { isAuthenticated } from '#src/middlewares/session.middleware.js';
import { closeMatchValidators } from '#src/validators/v1/matches/matches.close.validators.js';
import { createMatchValidators } from '#src/validators/v1/matches/matches.create.validators.js';
import { getMatchValidators } from '#src/validators/v1/matches/matches.get.validators.js';
import { getMatchChatHistoryValidators } from '#src/validators/v1/matches/matches.getChatHistory.validators.js';
import { getMatchStateValidators } from '#src/validators/v1/matches/matches.getState.validators.js';

const matchesRouter: Router = Router({
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
  getMatchStateController,
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
