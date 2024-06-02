import { randomUUID } from 'node:crypto';

import { Times } from '@packages/shared';
import type { RequestHandler } from 'express';
import expressSession from 'express-session';

import { environmentConfig } from '#src/configs/environmentConfig.js';

export const session: RequestHandler = expressSession({
  cookie: { maxAge: Times.Week, secure: true },
  genid: () => {
    return randomUUID();
  },
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
  secret: environmentConfig.sessionSecret,
  store: new expressSession.MemoryStore(),
});
