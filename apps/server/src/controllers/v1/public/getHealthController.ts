import type { RequestHandler } from 'express';

import { HttpStatusCodes } from '#src/constants/httpConstants.js';

export const getHealthController: RequestHandler = (_request, response) => {
  return response.sendStatus(HttpStatusCodes.Ok);
};
