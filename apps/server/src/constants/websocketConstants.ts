export enum WebSocketEvent {
  Close = 'close',
  Connection = 'connection',
  Error = 'error',
  Message = 'message',
}

export enum WebSocketState {
  Closed = 3,
  Closing = 2,
  Connecting = 0,
  Open = 1,
}
