import type {
  PostPublicOauthRequestBody,
  PostPublicOauthResponseBody,
} from '@packages/shared';
import { HttpStatusCodes } from '@packages/shared';
import type { RequestHandler } from 'express';

import { createOsuApiBearerToken } from '#src/queries/osu/oauth/createBearerTokenQueries.js';
import { getOsuOwnUser } from '#src/queries/osu/users/getUserQueries.js';
import { getOrCreateUser } from '#src/services/users/getOrCreateUserService.js';

export const postOauthController: RequestHandler<
  never,
  PostPublicOauthResponseBody,
  PostPublicOauthRequestBody,
  never
> = async (request, response, next) => {
  const { session } = request;
  const { code } = request.body;

  try {
    const { token } = await createOsuApiBearerToken(code);
    const osuUser = await getOsuOwnUser(token);
    const { isNew, user } = await getOrCreateUser(osuUser);
    const statusCode = isNew ? HttpStatusCodes.Created : HttpStatusCodes.Ok;

    session.user = {
      gameUserId: user.gameUserId,
      id: user.id,
      osuApiToken: token,
    };

    return response.status(statusCode).json({
      avatarUrl: user.avatarUrl,
      gameUserId: user.gameUserId,
      name: user.name,
    });
  } catch (error) {
    return next(error);
  }
};
