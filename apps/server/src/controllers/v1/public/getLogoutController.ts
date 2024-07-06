import type { GetPublicLogoutResponseBody } from '@packages/shared';
import { HttpStatusCodes } from '@packages/shared';
import type { RequestHandler } from 'express';

export const getLogoutController: RequestHandler<
  never,
  GetPublicLogoutResponseBody
> = (request, response) => {
  const { session } = request;

  session.destroy(() => {
    return {};
  });

  return response.status(HttpStatusCodes.NoContent).end();
};
