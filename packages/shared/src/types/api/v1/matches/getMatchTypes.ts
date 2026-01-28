import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';
import type { StringRecord } from '#src/sharedExport.js';

export interface GetMatchRequestParameters extends StringRecord {
  gameMatchId: string;
}

export interface GetMatchResponseData {
  endsAt: Date | null;
  gameMatchId: number;
  name: string;
}

export type GetMatchResponseBody = GetMatchResponseData | ErrorReport;
