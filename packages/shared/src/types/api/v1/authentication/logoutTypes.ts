import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';
import type { NothingRecord } from '#src/types/utilityTypes.js';

export type LogoutRequestBody = NothingRecord;
export type LogoutResponseBody = NothingRecord | ErrorReport;
