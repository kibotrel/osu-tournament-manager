import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';

export interface LoginRequestBody {
  authenticationCode: string;
}

export interface LoginResponseData {
  avatarUrl: string;
  gameUserId: number;
  name: string;
}

export type LoginResponseBody = LoginResponseData | ErrorReport;
