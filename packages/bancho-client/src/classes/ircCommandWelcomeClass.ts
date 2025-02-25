import type { BanchoClient } from '#src/classes/ircClientClass.js';
import type { IrcCommand } from '#src/classes/ircCommandClass.js';
import { BanchoClientEvent } from '#src/constants/banchoClientConstants.js';

export class IrcCommandWelcome implements IrcCommand {
  public readonly banchoClient: BanchoClient;

  constructor(banchoClient: BanchoClient) {
    this.banchoClient = banchoClient;
  }

  public handleCommand() {
    this.banchoClient.emit(BanchoClientEvent.Connected);
  }
}
