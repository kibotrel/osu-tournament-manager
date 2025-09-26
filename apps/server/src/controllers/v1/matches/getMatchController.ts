import {
  type CloseMatchRequestParameters,
  type GetMatchRequestParameters,
  type GetMatchResponseBody,
  HttpStatusCode,
} from '@packages/shared';
import type { RequestHandler } from 'express';
import { matchedData } from 'express-validator';

import { getMatchService } from '#src/services/matches/matchesService.js';

export const getMatchController: RequestHandler<
  GetMatchRequestParameters,
  GetMatchResponseBody,
  never,
  never
> = async (request, response, next) => {
  const { id } = matchedData<CloseMatchRequestParameters>(request);

  try {
    const match = await getMatchService(Number(id));

    return response.status(HttpStatusCode.Ok).json(match);
  } catch (error) {
    return next(error);
  }
};
