import type { BanchoLobbyState } from './banchoTypes.js';
import type { UnknownRecord } from './utilityTypes.js';

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
