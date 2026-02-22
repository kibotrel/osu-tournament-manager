import type { BanchoClient } from '#src/classes/ircClient.class.js';
import type { IrcCommand } from '#src/classes/ircCommand.class.js';
import { BanchoClientEvent } from '#src/constants/banchoClient.constants.js';

export class IrcCommandChannelNotFound implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];

  constructor(banchoClient: BanchoClient, packetParts: string[]) {
    this.banchoClient = banchoClient;
    this.packetParts = packetParts;
  }

  public handleCommand() {
    const channel = this.packetParts.at(0)!.split(' ').at(3)!;

    this.banchoClient.emit(BanchoClientEvent.ChannelNotFound, { channel });
    this.banchoClient.emit(`${BanchoClientEvent.ChannelNotFound}:${channel}`);
  }
}
