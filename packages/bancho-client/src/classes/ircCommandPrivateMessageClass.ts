import { BanchoClientEvent } from '#src/banchoClientExport.js';
import type { BanchoClient } from '#src/classes/ircClientClass.js';
import type { IrcCommand } from '#src/classes/ircCommandClass.js';
import { parseIrcUsername } from '#src/methods/parseMethods.js';

export class IrcCommandPrivateMessage implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];

  constructor(banchoClient: BanchoClient, packetParts: string[]) {
    this.banchoClient = banchoClient;
    this.packetParts = packetParts;
  }

  // TODO: Handle the ACTION feture
  public handleCommand() {
    const [user, , channel] = this.packetParts.at(0)!.split(' ');
    const message = this.packetParts.slice(1).join(':');

    this.banchoClient.emit(
      BanchoClientEvent.ChannelMessage,
      parseIrcUsername(user.split('!').at(0)!),
      channel,
      message,
    );
  }
}
