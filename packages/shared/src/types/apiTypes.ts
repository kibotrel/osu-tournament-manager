import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';

// GET /public/logout
export interface GetPublicLogoutResponseBody {
  [key: string]: never;
}

// POST /public/oauth
export interface PostPublicOauthRequestBody {
  code: string;
}

interface SmallUser {
  avatarUrl: string;
  gameUserId: number;
  name: string;
}

export type PostPublicOauthResponseBody = SmallUser | ErrorReport;
