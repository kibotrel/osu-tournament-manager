import type {
  PostPublicLoginRequestBody,
  PostPublicLoginResponseBody,
} from '@packages/shared';
import { HttpHeader, HttpStatusCode } from '@packages/shared';
import type { RequestHandler } from 'express';

import { loginWithOsu } from '#src/services/login/loginWithOsuService.js';

export const postLoginController: RequestHandler<
  never,
  PostPublicLoginResponseBody,
  PostPublicLoginRequestBody,
  never
> = async (request, response, next) => {
  const { session } = request;
  const { code } = request.body;

  try {
    const { bearer, isNew, metrics, user } = await loginWithOsu(code);
    const statusCode = isNew ? HttpStatusCode.Created : HttpStatusCode.Ok;

    session.user = {
      gameApiBearer: bearer,
      gameUserId: user.gameUserId,
      id: user.id,
    };

    response.setHeader(HttpHeader.ServerTiming, metrics);

    return response.status(statusCode).json({
      avatarUrl: user.avatarUrl,
      gameUserId: user.gameUserId,
      name: user.name,
    });
  } catch (error) {
    return next(error);
  }
};
