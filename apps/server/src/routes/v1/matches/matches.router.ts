import { Router } from 'express';

import { closeMatchController } from '#src/controllers/v1/matches/matches.close.controller.js';
import { createMatchController } from '#src/controllers/v1/matches/matches.create.controller.js';
import { getMatchController } from '#src/controllers/v1/matches/matches.get.controller.js';
import { getMatchChatHistoryController } from '#src/controllers/v1/matches/matches.getChatHistory.controller.js';
import { getMatchStateController } from '#src/controllers/v1/matches/matches.getState.controller.js';
import { validateRequestMiddleware } from '#src/middlewares/requestValidator.middleware.js';
import { isAuthenticatedMiddleware } from '#src/middlewares/session.middleware.js';
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

matchesRouter.use(isAuthenticatedMiddleware);
matchesRouter.post(
  '/',
  createMatchValidators(),
  validateRequestMiddleware,
  createMatchController,
);
matchesRouter.get(
  '/:gameMatchId/chat-history',
  getMatchChatHistoryValidators(),
  validateRequestMiddleware,
  getMatchChatHistoryController,
);
matchesRouter.get(
  '/:gameMatchId/state',
  getMatchStateValidators(),
  validateRequestMiddleware,
  getMatchStateController,
);
matchesRouter.post(
  '/:gameMatchId/close',
  closeMatchValidators(),
  validateRequestMiddleware,
  closeMatchController,
);
matchesRouter.get(
  '/:gameMatchId',
  getMatchValidators(),
  validateRequestMiddleware,
  getMatchController,
);

export { matchesRouter };
