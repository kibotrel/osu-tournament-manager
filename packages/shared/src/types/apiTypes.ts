import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';
import type { Nothing } from '#src/types/utilityTypes.js';

export type GetPublicLogoutResponseBody = Nothing | ErrorReport;

export interface PostPublicLoginRequestBody {
  code: string;
}

interface SmallUser {
  avatarUrl: string;
  gameUserId: number;
  name: string;
}

export type PostPublicLoginResponseBody = SmallUser | ErrorReport;
