export enum IrcEvent {
  Close = 'close',
  Connect = 'connect',
  Data = 'data',
  Timeout = 'timeout',
}

export enum IrcClientState {
  Disconnected = 'disconnected',
  Disconnecting = 'disconnecting',
  Connecting = 'connecting',
  Connected = 'connected',
}
