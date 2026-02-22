import type { BanchoLobbyState } from './bancho.types.js';
import type { UnknownRecord } from './utility.types.js';

export interface WebSocketMatchMessage {
  author: string;
  content: string;
}

export type WebSocketMatchLobbyState = BanchoLobbyState;

export interface WebSocketMessage<T = UnknownRecord> {
  message: T;
  topic: string;
  timestamp: number;
}
