import type {
  CreateMatchRequestBody,
  CreateMatchResponseBody,
} from '@packages/shared';
import type { RequestHandler } from 'express';
import { matchedData } from 'express-validator';

import { openMatch } from '#src/services/matches/matchesService.js';

export const createMatchController: RequestHandler<
  never,
  CreateMatchResponseBody,
  CreateMatchRequestBody,
  never
> = async (request, response, next) => {
  const { name } = matchedData<CreateMatchRequestBody>(request);

  try {
    const { gameMatchId, id } = await openMatch(name);

    return response.status(201).json({
      gameMatchId,
      id,
      name,
    });
  } catch (error) {
    return next(error);
  }
};
