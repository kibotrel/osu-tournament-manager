import type { RequestHandler } from 'express';

import { HttpNotFoundError } from '#src/classes/httpErrorClass.js';
import { HttpStatusCodes } from '#src/constants/httpConstants.js';
import { getUserByGameUserId } from '#src/queries/users/getUserQueries.js';

interface RequestPath {
  gameUserId: string;
}

interface ResponseBody {
  id: number;
}

export const getUserController: RequestHandler<
  RequestPath,
  ResponseBody
> = async (request, response, next) => {
  const { gameUserId } = request.params;
  const user = await getUserByGameUserId(Number(gameUserId));

  if (!user) {
    return next(new HttpNotFoundError({ message: `User not found.` }));
  }

  return response.status(HttpStatusCodes.Ok).json({ id: user.id });
};
