export interface ExtendedWebSocket extends WebSocket {
  pongTimeout?: NodeJS.Timeout;
}
