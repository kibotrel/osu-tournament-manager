import { HttpStatusCode } from '@packages/shared';
import type { RequestHandler } from 'express';

export const healthController: RequestHandler<never, never, never, never> = (
  _request,
  response,
) => {
  return response.status(HttpStatusCode.NoContent).end();
};
