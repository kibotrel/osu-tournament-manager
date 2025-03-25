import type { BanchoClient } from '#src/classes/ircClientClass.js';
import type { IrcCommand } from '#src/classes/ircCommandClass.js';
import { BanchoClientEvent } from '#src/constants/banchoClientConstants.js';

export class IrcCommandChannelTopic implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];

  constructor(banchoClient: BanchoClient, packetParts: string[]) {
    this.banchoClient = banchoClient;
    this.packetParts = packetParts;
  }

  public handleCommand() {
    const channelName = this.packetParts.at(0)?.split(' ').at(3);

    this.banchoClient.emit(BanchoClientEvent.BotJoinedChannel, channelName);
    this.banchoClient.emit(
      `${BanchoClientEvent.BotJoinedChannel}:${channelName}`,
    );
  }
}
