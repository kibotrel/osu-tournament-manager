import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';
import type {
  StringRecord,
  WebSocketMatchLobbyState,
} from '#src/sharedExport.js';

export interface GetMatchStateRequestParameters extends StringRecord {
  gameMatchId: string;
}

export interface GetMatchStateResponseData {
  state: WebSocketMatchLobbyState;
}

export type GetMatchStateResponseBody = GetMatchStateResponseData | ErrorReport;
