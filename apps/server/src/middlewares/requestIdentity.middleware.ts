/* eslint no-param-reassign: ["error", { "props": false }] */

import { randomUUID } from 'node:crypto';

import { HttpHeader } from '@packages/shared';
import type { RequestHandler } from 'express';

export const setRequestIdMiddleware: RequestHandler = (
  request,
  response,
  next,
) => {
  const uniqueId = randomUUID();

  request.id = uniqueId;
  response.setHeader(HttpHeader.RequestId, uniqueId);

  return next();
};
