import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';
import type {
  StringRecord,
  WebSocketMessage,
  WebSocketMessageMatch,
} from '#src/sharedExport.js';

export interface GetMatchChatHistoryRequestParameters extends StringRecord {
  gameMatchId: string;
}

export interface GetMatchChatHistoryResponseData {
  history: Array<WebSocketMessage<WebSocketMessageMatch>>;
}

export type GetMatchChatHistoryResponseBody =
  | GetMatchChatHistoryResponseData
  | ErrorReport;
