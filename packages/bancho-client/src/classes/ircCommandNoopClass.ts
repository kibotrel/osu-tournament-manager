import type { BanchoClient } from '#src/classes/ircClientClass.js';
import type { IrcCommand } from '#src/classes/ircCommandClass.js';
import type { IrcKeyword } from '#src/constants/ircConstants.js';

export class IrcCommandNoop implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly command: IrcKeyword;
  public readonly packetParts: string[];

  constructor(
    banchoClient: BanchoClient,
    command: IrcKeyword,
    packetParts: string[],
  ) {
    this.banchoClient = banchoClient;
    this.command = command;
    this.packetParts = packetParts;
  }

  public handleCommand() {
    /**
     * Temporary catch-all logger to see what commands could be implemented
     * in the future.
     */
    console.log({ command: this.command, packetParts: this.packetParts });
  }
}
