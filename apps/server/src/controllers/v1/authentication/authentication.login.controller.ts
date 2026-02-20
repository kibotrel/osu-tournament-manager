import type { LoginRequestBody, LoginResponseBody } from '@packages/shared';
import { HttpStatusCode } from '@packages/shared';
import type { RequestHandler } from 'express';
import { matchedData } from 'express-validator';

import { loginWithOsu } from '#src/services/authentication/authentication.loginWithOsu.service.js';

export const loginController: RequestHandler<
  never,
  LoginResponseBody,
  LoginRequestBody,
  never
> = async (request, response, next) => {
  const { session } = request;
  const { authenticationCode } = matchedData<LoginRequestBody>(request);

  try {
    const { bearer, isNew, user } = await loginWithOsu(authenticationCode);
    const statusCode = isNew ? HttpStatusCode.Created : HttpStatusCode.Ok;

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
