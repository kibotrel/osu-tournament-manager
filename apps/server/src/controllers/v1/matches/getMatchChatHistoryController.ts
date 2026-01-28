import type {
  GetMatchChatHistoryRequestParameters,
  GetMatchChatHistoryResponseBody,
  GetMatchRequestParameters,
} from '@packages/shared';
import { HttpStatusCode } from '@packages/shared';
import type { RequestHandler } from 'express';
import { matchedData } from 'express-validator';

import { getMatchChatHistoryService } from '#src/services/matches/matchesService.js';

export const getMatchChatHistoryController: RequestHandler<
  GetMatchChatHistoryRequestParameters,
  GetMatchChatHistoryResponseBody,
  never,
  never
> = async (request, response, next) => {
  const { gameMatchId } = matchedData<GetMatchRequestParameters>(request);

  try {
    const history = await getMatchChatHistoryService(gameMatchId);

    return response.status(HttpStatusCode.Ok).json({ history });
  } catch (error) {
    return next(error);
  }
};
