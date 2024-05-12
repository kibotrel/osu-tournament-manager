import type { Router } from 'express';
import express from 'express';

import { getUserController } from '#src/controllers/v1/users/getUserController.js';

const usersRouter: Router = express.Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

usersRouter.get('/:gameUserId', getUserController);

export { usersRouter };
