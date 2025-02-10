export interface WebSocketMessageMatch {
  author: string;
  content: string;
}

export interface WebSocketMessage<T = Record<string, unknown>> {
  message: T;
  timestamp: number;
}
