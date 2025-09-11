import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';

export interface PostPublicLoginRequestBody {
  authenticationCode: string;
}

export interface PostPublicLoginResponseData {
  avatarUrl: string;
  gameUserId: number;
  name: string;
}

export type PostPublicLoginResponseBody =
  | PostPublicLoginResponseData
  | ErrorReport;
