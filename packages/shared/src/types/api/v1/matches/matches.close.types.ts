import type { ErrorReport } from '#src/classes/httpErrorReport.class.js';
import type { StringRecord } from '#src/shared.export.js';

export interface CloseMatchRequestParameters extends StringRecord {
  gameMatchId: string;
}

export interface CloseMatchResponseData {
  status: 'closed';
}

export type CloseMatchResponseBody = CloseMatchResponseData | ErrorReport;
