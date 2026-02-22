import { BanchoClientEvent } from '#src/banchoClient.export.js';
import type { BanchoClient } from '#src/classes/ircClient.class.js';
import type { IrcCommand } from '#src/classes/ircCommand.class.js';

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
