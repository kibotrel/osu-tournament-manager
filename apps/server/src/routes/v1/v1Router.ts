import { Router } from 'express';

import { authenticationRouter } from './authentication/authenticationRouter.js';
import { matchesRouter } from './matches/matchesRouter.js';
import { publicRouter } from './public/publicRouter.js';

const v1Router: Router = Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

v1Router.use('/authentication', authenticationRouter);
v1Router.use('/matches', matchesRouter);
v1Router.use('/public', publicRouter);

export { v1Router };
