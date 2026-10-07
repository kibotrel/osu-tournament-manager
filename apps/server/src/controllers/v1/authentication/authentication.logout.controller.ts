import type { RequestHandler } from 'express';

import type { LogoutResponseBody } from '@packages/shared';
import { HttpStatusCode } from '@packages/shared';

export const logoutController: RequestHandler<never, LogoutResponseBody> = (request, response) => {
  const { session } = request;

  session.destroy(() => {
    return {};
  });

  return response.status(HttpStatusCode.NoContent).end();
};
