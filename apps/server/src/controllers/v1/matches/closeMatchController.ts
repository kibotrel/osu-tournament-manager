import {
  type CloseMatchRequestParameters,
  type CloseMatchResponseBody,
  HttpStatusCode,
} from '@packages/shared';
import type { RequestHandler } from 'express';
import { matchedData } from 'express-validator';

import { closeMatchService } from '#src/services/matches/matchesService.js';

export const closeMatchController: RequestHandler<
  CloseMatchRequestParameters,
  CloseMatchResponseBody,
  never,
  never
> = async (request, response, next) => {
  const { id } = matchedData<CloseMatchRequestParameters>(request);

  try {
    const { status } = await closeMatchService(Number(id));

    return response.status(HttpStatusCode.Ok).json({ status });
  } catch (error) {
    return next(error);
  }
};
