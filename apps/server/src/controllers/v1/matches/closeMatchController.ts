import type {
  CloseMatchRequestParameters,
  CloseMatchResponseBody,
} from '@packages/shared';
import type { RequestHandler } from 'express';
import { matchedData } from 'express-validator';

import { closeMatch } from '#src/services/matches/matchesService.js';

export const closeMatchController: RequestHandler<
  CloseMatchRequestParameters,
  CloseMatchResponseBody,
  never,
  never
> = async (request, response, next) => {
  const { id } = matchedData<CloseMatchRequestParameters>(request);

  try {
    const { status } = await closeMatch(Number(id));

    return response.status(200).json({ status });
  } catch (error) {
    return next(error);
  }
};
