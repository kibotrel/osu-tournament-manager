import type { BanchoClient } from '#src/classes/ircClientClass.js';
import type { IrcCommand } from '#src/classes/ircCommandClass.js';
import { IrcKeyword } from '#src/constants/ircConstants.js';

export class IrcCommandJoin implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];

  constructor(banchoClient: BanchoClient, packetParts: string[]) {
    this.banchoClient = banchoClient;
    this.packetParts = packetParts;
  }

  public handleCommand() {
    this.banchoClient.sendMessage(
      `${IrcKeyword.Pong} ${this.packetParts.join(' ')}`,
    );
  }
}
