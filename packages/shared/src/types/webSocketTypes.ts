import type { UnknownRecord } from './utilityTypes.js';

export interface WebSocketMessageMatch {
  author: string;
  content: string;
}

export interface WebSocketMessage<T = UnknownRecord> {
  message: T;
  topic: string;
  timestamp: number;
}
