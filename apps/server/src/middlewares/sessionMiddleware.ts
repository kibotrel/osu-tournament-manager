import { randomUUID } from 'node:crypto';

import { HttpUnauthorizedError, Time } from '@packages/shared';
import { RedisStore } from 'connect-redis';
import type { RequestHandler } from 'express';
import expressSession from 'express-session';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { cache } from '#src/dependencies/cacheDependency.js';

export const session: RequestHandler = expressSession({
  cookie: { maxAge: Time.Week, secure: true },
  genid: () => {
    return randomUUID();
  },
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
  secret: environmentConfig.sessionSecret,
  store: new RedisStore({ client: cache }),
});

export const isAuthenticated: RequestHandler = (request, _response, next) => {
  if (request.session?.user) {
    return next();
  }

  return next(
    new HttpUnauthorizedError({
      message: 'You must be authenticated to access this resource',
    }),
  );
};
