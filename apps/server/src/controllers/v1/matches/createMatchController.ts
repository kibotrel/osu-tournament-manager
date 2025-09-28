import {
  type CreateMatchRequestBody,
  type CreateMatchResponseBody,
  HttpStatusCode,
} from '@packages/shared';
import type { RequestHandler } from 'express';
import { matchedData } from 'express-validator';

import { openMatchService } from '#src/services/matches/matchesService.js';

export const createMatchController: RequestHandler<
  never,
  CreateMatchResponseBody,
  CreateMatchRequestBody,
  never
> = async (request, response, next) => {
  const { name } = matchedData<CreateMatchRequestBody>(request);

  try {
    const { gameMatchId, id } = await openMatchService(name);

    return response.status(HttpStatusCode.Created).json({
      gameMatchId,
      id,
      name,
    });
  } catch (error) {
    return next(error);
  }
};
