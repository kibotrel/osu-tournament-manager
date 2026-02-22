import { BanchoClientEvent } from '#src/banchoClient.export.js';
import type { BanchoClient } from '#src/classes/ircClient.class.js';
import type { IrcCommand } from '#src/classes/ircCommand.class.js';
import { parseIrcUsername } from '#src/methods/parse.methods.js';

export class IrcCommandJoin implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];

  constructor(banchoClient: BanchoClient, packetParts: string[]) {
    this.banchoClient = banchoClient;
    this.packetParts = packetParts;
  }

  public handleCommand() {
    const channel = this.packetParts.at(1)!;
    const user = parseIrcUsername(this.packetParts.at(0)!.split('!').at(0)!);

    this.banchoClient.emit(BanchoClientEvent.UserJoinedChannel, {
      channel,
      user,
    });
    this.banchoClient.emit(
      `${BanchoClientEvent.UserJoinedChannel}:${channel}`,
      { user },
    );
  }
}
