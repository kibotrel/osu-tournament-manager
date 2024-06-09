import {
  HttpError,
  HttpRequest,
  HttpStatusCodesToMessagesMapping,
} from '@packages/shared';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { OsuGrantTypes } from '#src/constants/osuConstants.js';

export interface CreateOsuApitBearerTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface OsuBearerToken {
  token: string;
  refreshToken: string;
}

/**
 * Exchange the `code` for an osu! API bearer token which can be used to authenticate later requests.
 */
export const createOsuApiBearerToken = async (
  code: string,
): Promise<OsuBearerToken> => {
  const request = new HttpRequest()
    .setBaseUrl(environmentConfig.osuBaseUrl)
    .setPayload({
      client_id: environmentConfig.osuClientId,
      client_secret: environmentConfig.osuClientSecret,
      code,
      grant_type: OsuGrantTypes.AuthorizationCode,
      redirect_uri: `${environmentConfig.baseUrl}/oauth/callback`,
    });
  const response =
    await request.post<CreateOsuApitBearerTokenResponse>('/oauth/token');

  if (!response.isOk) {
    throw new HttpError({
      status: response.status,
      message: HttpStatusCodesToMessagesMapping[response.status],
    });
  }

  return {
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
  };
};
