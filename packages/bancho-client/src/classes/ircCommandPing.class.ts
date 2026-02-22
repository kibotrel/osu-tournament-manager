import type { BanchoClient } from '#src/classes/ircClient.class.js';
import type { IrcCommand } from '#src/classes/ircCommand.class.js';
import { IrcKeyword } from '#src/constants/irc.constants.js';

export class IrcCommandPing implements IrcCommand {
  public readonly banchoClient: BanchoClient;

  constructor(banchoClient: BanchoClient) {
    this.banchoClient = banchoClient;
  }

  public async handleCommand() {
    await this.banchoClient.sendIrcMessage(
      `${IrcKeyword.Pong} ${this.banchoClient.serverInformation.host}`,
    );
  }
}
