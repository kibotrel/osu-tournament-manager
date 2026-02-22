import type { ErrorReport } from '#src/classes/httpErrorReport.class.js';

export interface CreateMatchRequestBody {
  name: string;
}

export interface CreateMatchResponseData {
  gameMatchId: number;
  name: string;
}

export type CreateMatchResponseBody = CreateMatchResponseData | ErrorReport;
