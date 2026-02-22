import type { ErrorReport } from '#src/classes/httpErrorReport.class.js';
import type { NothingRecord } from '#src/types/utility.types.js';

export type LogoutRequestBody = NothingRecord;
export type LogoutResponseBody = NothingRecord | ErrorReport;
