import type { ErrorReport } from '#src/classes/httpErrorReport.class.js';
import type {
  StringRecord,
  WebSocketMatchMessage,
  WebSocketMessage,
} from '#src/shared.export.js';

export interface GetMatchChatHistoryRequestParameters extends StringRecord {
  gameMatchId: string;
}

export interface GetMatchChatHistoryResponseData {
  history: Array<WebSocketMessage<WebSocketMatchMessage>>;
}

export type GetMatchChatHistoryResponseBody =
  | GetMatchChatHistoryResponseData
  | ErrorReport;
