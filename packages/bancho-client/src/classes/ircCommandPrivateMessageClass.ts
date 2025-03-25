import { BanchoClientEvent } from '#src/banchoClientExport.js';
import type { BanchoClient } from '#src/classes/ircClientClass.js';
import type { IrcCommand } from '#src/classes/ircCommandClass.js';
import {
  BanchoCommonMessage,
  BanchoUser,
} from '#src/constants/banchoClientConstants.js';
import { parseIrcUsername } from '#src/methods/parseMethods.js';

export class IrcCommandPrivateMessage implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];

  constructor(banchoClient: BanchoClient, packetParts: string[]) {
    this.banchoClient = banchoClient;
    this.packetParts = packetParts;
  }

  // TODO: Handle the ACTION feture
  public handleCommand() {
    const [user, , channel] = this.packetParts.at(0)!.split(' ');
    const message = this.packetParts.slice(1).join(':');
    const sanitizedUser = parseIrcUsername(user.split('!').at(0)!);

    this.banchoClient.emit(
      BanchoClientEvent.ChannelMessage,
      sanitizedUser,
      channel,
      message,
    );

    // TODO: Probably going to refactor this as a separate function when adding more cases
    if (
      sanitizedUser === BanchoUser.BanchoBot &&
      message === BanchoCommonMessage.ClosedMatch
    ) {
      this.banchoClient.emit(
        BanchoClientEvent.MultiplayerChannelClosed,
        channel,
      );
      this.banchoClient.emit(
        `${BanchoClientEvent.MultiplayerChannelClosed}:${channel}`,
      );
    }
  }
}
