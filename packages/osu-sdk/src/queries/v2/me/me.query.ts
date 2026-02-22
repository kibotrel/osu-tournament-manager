import type { NothingRecord } from '@packages/shared';
import { HttpError, getRequest } from '@packages/shared';

import { BASE_URL } from '#src/constants/osu.constants.js';

export interface OsuGetMeQueryRequestQuery {
  token: string;
}

export interface OsuGetMeQueryResponseBody {
  avatarUrl: string;
  country: string;
  id: number;
  name: string;
}

type InternalOsuGetMeQueryRequestQuery = NothingRecord;

interface InternalOsuGetMeQueryResponseBody {
  avatar_url: string;
  country_code: string;
  id: number;
  username: string;
}

/**
 * Get self user information from the osu! API.
 */
export const osuGetMeQuery = async (
  options: OsuGetMeQueryRequestQuery,
): Promise<OsuGetMeQueryResponseBody> => {
  const { token } = options;
  const response = await getRequest<
    InternalOsuGetMeQueryRequestQuery,
    InternalOsuGetMeQueryResponseBody
  >({
    baseUrl: BASE_URL,
    endpoint: '/me',
    payload: {},
    token,
    apiVersion: 'v2',
  });

  if (!response.isOk) {
    throw new HttpError({
      message: '[osu!api] Failed to get self user information',
      status: response.status,
      metadata: response.data as unknown as Record<string, unknown>,
    });
  }

  return {
    avatarUrl: response.data.avatar_url,
    country: response.data.country_code,
    id: response.data.id,
    name: response.data.username,
  };
};
