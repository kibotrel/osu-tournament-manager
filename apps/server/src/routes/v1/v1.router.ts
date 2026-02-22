import { Router } from 'express';

import { authenticationRouter } from './authentication/authentication.router.js';
import { matchesRouter } from './matches/matches.router.js';
import { publicRouter } from './public/public.router.js';

const v1Router: Router = Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

v1Router.use('/authentication', authenticationRouter);
v1Router.use('/matches', matchesRouter);
v1Router.use('/public', publicRouter);

export { v1Router };
