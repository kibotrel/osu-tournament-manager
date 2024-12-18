import { HttpStatusCode } from '@packages/shared';
import type { RequestHandler } from 'express';

export const getHealthController: RequestHandler<never, never, never, never> = (
  _request,
  response,
) => {
  return response.sendStatus(HttpStatusCode.Ok);
};
