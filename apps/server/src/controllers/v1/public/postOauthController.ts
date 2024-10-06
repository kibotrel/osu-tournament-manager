import type {
  PostPublicOauthRequestBody,
  PostPublicOauthResponseBody,
} from '@packages/shared';
import { HttpStatusCodes } from '@packages/shared';
import type { RequestHandler } from 'express';

import { loginWithOsu } from '#src/services/login/loginWithOsuService.js';

export const postOauthController: RequestHandler<
  never,
  PostPublicOauthResponseBody,
  PostPublicOauthRequestBody,
  never
> = async (request, response, next) => {
  const { session } = request;
  const { code } = request.body;

  try {
    const { bearer, isNew, user } = await loginWithOsu(code);
    const statusCode = isNew ? HttpStatusCodes.Created : HttpStatusCodes.Ok;

    session.user = {
      gameApiBearer: bearer,
      gameUserId: user.gameUserId,
      id: user.id,
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
