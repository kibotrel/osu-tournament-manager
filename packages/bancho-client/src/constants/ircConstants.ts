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

/**
 * List of [RFC 1459](https://tools.ietf.org/html/rfc1459) compliant IRC commands.
 */
export enum IrcKeyword {
  ChannelTopic = '332',
  ChannelTopicUpdatedAt = '333',
  EndOfNameList = '366',
  MessageOfTheDayBegin = '375',
  MessageOfTheDayBody = '372',
  MessageOfTheDayEnd = '376',
  Mode = 'MODE',
  NameListBody = '353',
  Nickname = 'NICK',
  Password = 'PASS',
  Ping = 'PING',
  Pong = 'PONG',
  Quit = 'QUIT',
  Username = 'USER',
  Welcome = '001',
}
