import type { RequestHandler } from 'express';

import { HttpStatusCode } from '@packages/shared';

export const healthController: RequestHandler<never, never, never, never> = (
  _request,
  response,
) => {
  return response.status(HttpStatusCode.NoContent).end();
};
