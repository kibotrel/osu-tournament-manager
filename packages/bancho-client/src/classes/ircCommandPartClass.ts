import { BanchoClientEvent } from '#src/banchoClientExport.js';
import type { BanchoClient } from '#src/classes/ircClientClass.js';
import type { IrcCommand } from '#src/classes/ircCommandClass.js';
import { parseIrcUsername } from '#src/methods/parseMethods.js';

export class IrcCommandPart implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];

  constructor(banchoClient: BanchoClient, packetParts: string[]) {
    this.banchoClient = banchoClient;
    this.packetParts = packetParts;
  }

  public handleCommand() {
    const [user] = this.packetParts.at(0)!.split(' ');
    const channel = this.packetParts.at(1)!;

    this.banchoClient.emit(
      BanchoClientEvent.UserLeftChannel,
      parseIrcUsername(user.split('!').at(0)!),
      channel,
    );
  }
}
