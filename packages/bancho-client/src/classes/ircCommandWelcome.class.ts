import type { BanchoClient } from '#src/classes/ircClient.class.js';
import type { IrcCommand } from '#src/classes/ircCommand.class.js';
import { BanchoClientEvent } from '#src/constants/banchoClient.constants.js';

export class IrcCommandWelcome implements IrcCommand {
  public readonly banchoClient: BanchoClient;

  constructor(banchoClient: BanchoClient) {
    this.banchoClient = banchoClient;
  }

  public handleCommand() {
    this.banchoClient.emit(BanchoClientEvent.BotConnected);
  }
}
