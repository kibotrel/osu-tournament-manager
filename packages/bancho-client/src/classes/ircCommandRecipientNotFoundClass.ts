import { BanchoClientEvent } from '#src/banchoClientExport.js';
import type { BanchoClient } from '#src/classes/ircClientClass.js';
import type { IrcCommand } from '#src/classes/ircCommandClass.js';

export class IrcCommandRecipientNotFound implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];

  constructor(banchoClient: BanchoClient, packetParts: string[]) {
    this.banchoClient = banchoClient;
    this.packetParts = packetParts;
  }

  public handleCommand() {
    const recipient = this.packetParts.at(0)!.split(' ').at(3)!;

    this.banchoClient.emit(BanchoClientEvent.RecipientNotFound, { recipient });
    this.banchoClient.emit(
      `${BanchoClientEvent.RecipientNotFound}:${recipient}`,
    );
  }
}
