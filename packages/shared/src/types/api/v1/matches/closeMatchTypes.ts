import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';
import type { StringRecord } from '#src/sharedExport.js';

export interface CloseMatchRequestParameters extends StringRecord {
  gameMatchId: string;
}

export interface CloseMatchResponseData {
  status: 'closed';
}

export type CloseMatchResponseBody = CloseMatchResponseData | ErrorReport;
