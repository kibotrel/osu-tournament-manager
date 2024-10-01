import type { Nothing } from '@packages/shared';
import { getRequest } from '@packages/shared';

import { baseUrl } from '#src/constants/index.js';

export interface OsuGetMeRequestQuery {
  token: string;
}

export interface OsuGetMeResponseBody {
  avatarUrl: string;
  gameUserId: number;
  name: string;
}

type InternalOsuGetMeRequestQuery = Nothing;

interface InternalOsuGetMeResponseBody {
  avatar_url: string;
  id: number;
  username: string;
}

/**
 * Get self user information from the osu! API.
 */
export const osuGetMe = async (options: OsuGetMeRequestQuery) => {
  const { token } = options;
  const response = await getRequest<
    InternalOsuGetMeRequestQuery,
    InternalOsuGetMeResponseBody
  >({
    baseUrl,
    endpoint: '/me',
    payload: {},
    token,
    apiVersion: 'v2',
  });

  if (!response.isOk) {
    throw new Error(
      '[osu!api]: Failed to get self user information from the osu! API.',
    );
  }

  return {
    avatarUrl: response.data.avatar_url,
    gameUserId: response.data.id,
    name: response.data.username,
  };
};
