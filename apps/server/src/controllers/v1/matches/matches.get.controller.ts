import {
  type GetMatchRequestParameters,
  type GetMatchResponseBody,
  HttpStatusCode,
} from '@packages/shared';
import type { RequestHandler } from 'express';
import { matchedData } from 'express-validator';

import { getMatchService } from '#src/services/matches/matches.service.js';

export const getMatchController: RequestHandler<
  GetMatchRequestParameters,
  GetMatchResponseBody,
  never,
  never
> = async (request, response, next) => {
  const { gameMatchId } = matchedData<GetMatchRequestParameters>(request);

  try {
    const match = await getMatchService(Number(gameMatchId));

    return response.status(HttpStatusCode.Ok).json(match);
  } catch (error) {
    return next(error);
  }
};
