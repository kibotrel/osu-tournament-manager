import type {
  PostPublicLoginRequestBody,
  PostPublicLoginResponseBody,
} from '@packages/shared';
import { HttpHeader, HttpStatusCode } from '@packages/shared';
import type { RequestHandler } from 'express';

import { CacheTopic } from '#src/constants/cacheConstants.js';
import { popCacheArrayByKey } from '#src/queries/cache/deleteCacheQueries.js';
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
    const { bearer, isNew, user } = await loginWithOsu(code);
    const statusCode = isNew ? HttpStatusCode.Created : HttpStatusCode.Ok;

    session.user = {
      gameApiBearer: bearer,
      gameUserId: user.gameUserId,
      id: user.id,
    };

    const metrics = await popCacheArrayByKey(
      `${CacheTopic.ServerMetrics}:${request.id}`,
    );

    response.setHeader(HttpHeader.ServerTiming, metrics.join(', '));

    return response.status(statusCode).json({
      avatarUrl: user.avatarUrl,
      gameUserId: user.gameUserId,
      name: user.name,
    });
  } catch (error) {
    return next(error);
  }
};
