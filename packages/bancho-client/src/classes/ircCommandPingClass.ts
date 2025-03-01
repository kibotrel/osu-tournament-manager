import type { BanchoClient } from '#src/classes/ircClientClass.js';
import type { IrcCommand } from '#src/classes/ircCommandClass.js';
import { IrcKeyword } from '#src/constants/ircConstants.js';

export class IrcCommandPing implements IrcCommand {
  public readonly banchoClient: BanchoClient;

  constructor(banchoClient: BanchoClient) {
    this.banchoClient = banchoClient;
  }

  public handleCommand() {
    this.banchoClient.sendIrcMessage(
      `${IrcKeyword.Pong} ${this.banchoClient.serverInformation.host}`,
    );
  }
}
