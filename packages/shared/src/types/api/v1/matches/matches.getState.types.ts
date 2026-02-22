import type { ErrorReport } from '#src/classes/httpErrorReport.class.js';
import type {
  StringRecord,
  WebSocketMatchLobbyState,
} from '#src/shared.export.js';

export interface GetMatchStateRequestParameters extends StringRecord {
  gameMatchId: string;
}

export interface GetMatchStateResponseData {
  state: WebSocketMatchLobbyState;
}

export type GetMatchStateResponseBody = GetMatchStateResponseData | ErrorReport;
