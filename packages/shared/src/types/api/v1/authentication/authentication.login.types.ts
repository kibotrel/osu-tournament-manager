import type { ErrorReport } from '#src/classes/httpErrorReport.class.js';

export interface LoginRequestBody {
  authenticationCode: string;
}

export interface LoginResponseData {
  avatarUrl: string;
  gameUserId: number;
  name: string;
}

export type LoginResponseBody = LoginResponseData | ErrorReport;
