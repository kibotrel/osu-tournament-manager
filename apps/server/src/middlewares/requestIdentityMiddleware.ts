/* eslint no-param-reassign: ["error", { "props": false }] */

import { randomUUID } from 'node:crypto';

import type { RequestHandler } from 'express';

export const setRequestId: RequestHandler = (request, response, next) => {
  const uniqueId = randomUUID();

  request.id = uniqueId;
  response.setHeader('X-Request-Id', uniqueId);

  return next();
};
