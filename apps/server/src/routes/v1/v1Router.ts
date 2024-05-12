import type { Router } from 'express';
import express from 'express';

import { usersRouter } from './users/usersRouter.js';

const v1Router: Router = express.Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

v1Router.use('/users', usersRouter);

export { v1Router };
