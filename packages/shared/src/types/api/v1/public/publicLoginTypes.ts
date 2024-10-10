import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';

export interface PostPublicLoginRequestBody {
  authenticationCode: string;
}

export type PostPublicLoginResponseBody =
  | {
      avatarUrl: string;
      gameUserId: number;
      name: string;
    }
  | ErrorReport;
