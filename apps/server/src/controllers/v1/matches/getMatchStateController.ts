import type {
  GetMatchRequestParameters,
  GetMatchStateRequestParameters,
  GetMatchStateResponseBody,
} from '@packages/shared';
import { HttpStatusCode } from '@packages/shared';
import type { RequestHandler } from 'express';
import { matchedData } from 'express-validator';

import { getMatchStateService } from '#src/services/matches/matchesService.js';

export const getMatchStateHistoryController: RequestHandler<
  GetMatchStateRequestParameters,
  GetMatchStateResponseBody,
  never,
  never
> = async (request, response, next) => {
  const { gameMatchId } = matchedData<GetMatchRequestParameters>(request);

  try {
    const state = await getMatchStateService(gameMatchId);

    return response.status(HttpStatusCode.Ok).json({ state });
  } catch (error) {
    return next(error);
  }
};
