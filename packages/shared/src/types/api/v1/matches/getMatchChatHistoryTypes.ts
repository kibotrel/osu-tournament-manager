import type { ErrorReport } from '#src/classes/httpErrorReportClass.js';
import type {
  StringRecord,
  WebSocketMatchMessage,
  WebSocketMessage,
} from '#src/sharedExport.js';

export interface GetMatchChatHistoryRequestParameters extends StringRecord {
  gameMatchId: string;
}

export interface GetMatchChatHistoryResponseData {
  history: Array<WebSocketMessage<WebSocketMatchMessage>>;
}

export type GetMatchChatHistoryResponseBody =
  | GetMatchChatHistoryResponseData
  | ErrorReport;
