import { BanchoClientEvent } from '#src/banchoClientExport.js';
import type { BanchoClient } from '#src/classes/ircClientClass.js';
import type { IrcCommand } from '#src/classes/ircCommandClass.js';
import { BanchoUser } from '#src/constants/banchoClientConstants.js';
import { parseIrcUsername } from '#src/methods/parseMethods.js';

/**
 * List of messages that the Bancho bot can send in response to a command.
 */
enum BanchoBotCommonMessage {
  ClosedMatch = 'Closed the match',
  InvitedUserToChannel = 'Invited (?<username>\\S+) to the room',
  UserAlreadyInChannel = 'User is already in the room',
  UserNotFound = 'User not found',
}

export class IrcCommandPrivateMessage implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];

  constructor(banchoClient: BanchoClient, packetParts: string[]) {
    this.banchoClient = banchoClient;
    this.packetParts = packetParts;
  }

  private emitBanchoBotEvents(channel: string, message: string) {
    const userInvitedToChannelRegularExpression = new RegExp(
      BanchoBotCommonMessage.InvitedUserToChannel,
    );

    if (userInvitedToChannelRegularExpression.test(message)) {
      const [, username] = message.match(
        userInvitedToChannelRegularExpression,
      )!;

      this.banchoClient.emit(
        BanchoClientEvent.UserInvitedToChannel,
        channel,
        username,
      );
      this.banchoClient.emit(
        `${BanchoClientEvent.UserInvitedToChannel}:${channel}`,
        username,
      );
      this.banchoClient.emit(
        `${BanchoClientEvent.UserInvitedToChannel}:${channel}:${username}`,
      );

      return;
    }

    switch (message) {
      case BanchoBotCommonMessage.ClosedMatch: {
        this.banchoClient.emit(
          BanchoClientEvent.MultiplayerChannelClosed,
          channel,
        );
        this.banchoClient.emit(
          `${BanchoClientEvent.MultiplayerChannelClosed}:${channel}`,
        );

        return;
      }

      case BanchoBotCommonMessage.UserNotFound: {
        return this.banchoClient.emit(BanchoClientEvent.UserNotFound);
      }

      case BanchoBotCommonMessage.UserAlreadyInChannel: {
        return this.banchoClient.emit(BanchoClientEvent.UserAlreadyInChannel);
      }

      default: {
        this.banchoClient.emit(
          `${BanchoClientEvent.UserInvitedToChannel}:DemonWaves:${channel}`,
        );
      }
    }
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

    if (sanitizedUser === BanchoUser.BanchoBot) {
      this.emitBanchoBotEvents(channel, message);
    }
  }
}
