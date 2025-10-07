import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';

export interface CreateMatchRequestBody {
  name: string;
}

export interface CreateMatchResponseData {
  gameMatchId: number;
  name: string;
}

export type CreateMatchResponseBody = CreateMatchResponseData | ErrorReport;
