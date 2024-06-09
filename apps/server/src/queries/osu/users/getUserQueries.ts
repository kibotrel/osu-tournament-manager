import {
  HttpError,
  HttpHeaders,
  HttpRequest,
  HttpStatusCodesToMessagesMapping,
} from '@packages/shared';

import { environmentConfig } from '#src/configs/environmentConfig.js';

export interface GetOsuOwnUserResponse {
  avatar_url: string;
  id: number;
  username: string;
}

export interface OsuUser {
  avatarUrl: string;
  gameUserId: number;
  name: string;
}

/**
 * Ask the osu! API for public information on the owner of `token` such as username and avatar.
 */
export const getOsuOwnUser = async (token: string): Promise<OsuUser> => {
  const request = new HttpRequest()
    .setBaseUrl(`${environmentConfig.osuBaseUrl}/api/v2`)
    .setHttpHeader(HttpHeaders.Authorization, `Bearer ${token}`);
  const response = await request.get<GetOsuOwnUserResponse>('/me');

  if (!response.isOk) {
    throw new HttpError({
      status: response.status,
      message: HttpStatusCodesToMessagesMapping[response.status],
    });
  }

  return {
    avatarUrl: response.data.avatar_url,
    gameUserId: response.data.id,
    name: response.data.username,
  };
};
