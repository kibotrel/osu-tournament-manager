import { IrcKeyword } from '#src/constants/irc.constants.js';

import type { BanchoClient } from './ircClient.class.js';
import { IrcCommandChannelNotFound } from './ircCommandChannelNotFound.class.js';
import { IrcCommandChannelTopic } from './ircCommandChannelTopic.class.js';
import { IrcCommandJoin } from './ircCommandJoin.class.js';
import { IrcCommandNameListBody } from './ircCommandNameListBody.class.js';
import { IrcCommandNoop } from './ircCommandNoop.class.js';
import { IrcCommandPart } from './ircCommandPart.class.js';
import { IrcCommandPrivateMessage } from './ircCommandPrivateMessage.class.js';
import { IrcCommandQuit } from './ircCommandQuit.class.js';
import { IrcCommandRecipientNotFound } from './ircCommandRecipientNotFound.class.js';
import { IrcCommandWelcome } from './ircCommandWelcome.class.js';

export class IrcCommandFactory {
  private readonly banchoClient: BanchoClient;

  constructor(banchoClient: BanchoClient) {
    this.banchoClient = banchoClient;
  }

  createCommandHandler(command: IrcKeyword, packetParts: string[]) {
    switch (command) {
      case IrcKeyword.ChannelTopic: {
        return new IrcCommandChannelTopic(this.banchoClient, packetParts);
      }

      case IrcKeyword.ChannelNotFound: {
        return new IrcCommandChannelNotFound(this.banchoClient, packetParts);
      }

      case IrcKeyword.Join: {
        return new IrcCommandJoin(this.banchoClient, packetParts);
      }

      case IrcKeyword.NameListBody: {
        return new IrcCommandNameListBody(this.banchoClient, packetParts);
      }

      case IrcKeyword.Part: {
        return new IrcCommandPart(this.banchoClient, packetParts);
      }

      case IrcKeyword.PrivateMessage: {
        return new IrcCommandPrivateMessage(this.banchoClient, packetParts);
      }

      case IrcKeyword.Quit: {
        return new IrcCommandQuit(this.banchoClient, packetParts);
      }

      case IrcKeyword.RecipientNotFound: {
        return new IrcCommandRecipientNotFound(this.banchoClient, packetParts);
      }

      case IrcKeyword.Welcome: {
        return new IrcCommandWelcome(this.banchoClient);
      }

      default: {
        return new IrcCommandNoop(this.banchoClient, command, packetParts);
      }
    }
  }
}
