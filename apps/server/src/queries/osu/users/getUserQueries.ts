import type { OsuGetMeResponseBody } from '@packages/osu-sdk';
import { osuGetMe } from '@packages/osu-sdk';

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
export const getOsuOwnUser = async (
  token: string,
): Promise<OsuGetMeResponseBody> => {
  const { avatarUrl, gameUserId, name } = await osuGetMe({
    token,
  });

  return { avatarUrl, gameUserId, name };
};
