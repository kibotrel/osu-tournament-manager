import type { Router } from 'express';
import express from 'express';

import { publicRouter } from '#src/routes/v1/public/publicRouter.js';

const v1Router: Router = express.Router({
  caseSensitive: true,
  strict: true,
  mergeParams: true,
});

v1Router.use('/public', publicRouter);

export { v1Router };
