import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';

export interface PostPublicLoginRequestBody {
  code: string;
}

export type PostPublicLoginResponseBody =
  | {
      avatarUrl: string;
      gameUserId: number;
      name: string;
    }
  | ErrorReport;
