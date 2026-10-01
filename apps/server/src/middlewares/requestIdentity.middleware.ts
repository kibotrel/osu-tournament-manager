/* eslint no-param-reassign: ["error", { "props": false }] */

import { randomUUID } from 'node:crypto';

import type { RequestHandler } from 'express';

import { HttpHeader } from '@packages/shared';

export const setRequestIdMiddleware: RequestHandler = (request, response, next) => {
  const uniqueId = randomUUID();

  request.id = uniqueId;
  response.setHeader(HttpHeader.RequestId, uniqueId);

  return next();
};
