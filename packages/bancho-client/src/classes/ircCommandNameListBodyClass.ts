import type { BanchoClient } from '#src/classes/ircClientClass.js';
import type { IrcCommand } from '#src/classes/ircCommandClass.js';
import { BanchoClientEvent } from '#src/constants/banchoClientConstants.js';
import { parseIrcUsername } from '#src/methods/parseMethods.js';

export class IrcCommandNameListBody implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];

  constructor(banchoClient: BanchoClient, packetParts: string[]) {
    this.banchoClient = banchoClient;
    this.packetParts = packetParts;
  }

  public handleCommand() {
    const channel = this.packetParts.at(0)?.split('=')?.at(1)?.trim();
    const users = this.packetParts.at(-1)!.split(' ').filter(Boolean);

    this.banchoClient.emit(
      BanchoClientEvent.AddChannelMembers,
      channel,
      users.map((user) => {
        return parseIrcUsername(user);
      }),
    );
  }
}
