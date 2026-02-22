import { BanchoClientEvent } from '#src/banchoClient.export.js';
import type { BanchoClient } from '#src/classes/ircClient.class.js';
import type { IrcCommand } from '#src/classes/ircCommand.class.js';
import { parseIrcUsername } from '#src/methods/parse.methods.js';

export class IrcCommandPart implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];

  constructor(banchoClient: BanchoClient, packetParts: string[]) {
    this.banchoClient = banchoClient;
    this.packetParts = packetParts;
  }

  public handleCommand() {
    const [username] = this.packetParts.at(0)!.split(' ');
    const channel = this.packetParts.at(1)!;
    const user = parseIrcUsername(username.split('!').at(0)!);

    this.banchoClient.emit(BanchoClientEvent.UserLeftChannel, {
      channel,
      user,
    });
    this.banchoClient.emit(`${BanchoClientEvent.UserLeftChannel}:${channel}`, {
      user,
    });

    if (user === this.banchoClient.username) {
      this.banchoClient.emit(BanchoClientEvent.MultiplayerChannelClosed, {
        channel,
      });
      this.banchoClient.emit(
        `${BanchoClientEvent.MultiplayerChannelClosed}:${channel}`,
      );
    }
  }
}
