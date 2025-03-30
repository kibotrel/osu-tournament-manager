import { BanchoClientEvent } from '#src/banchoClientExport.js';
import type { BanchoClient } from '#src/classes/ircClientClass.js';
import type { IrcCommand } from '#src/classes/ircCommandClass.js';

export class IrcCommandQuit implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];

  constructor(banchoClient: BanchoClient, packetParts: string[]) {
    this.banchoClient = banchoClient;
    this.packetParts = packetParts;
  }

  public handleCommand() {
    const user = this.packetParts.at(0)!.split('!')!.at(0)!.slice(1);

    this.banchoClient.emit(BanchoClientEvent.UserDisconnected, { user });
  }
}
