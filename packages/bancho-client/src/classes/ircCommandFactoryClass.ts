import { IrcKeyword } from '#src/constants/ircConstants.js';

import type { BanchoClient } from './ircClientClass.js';
import { IrcCommandChannelTopic } from './ircCommandChannelTopicClass.js';
import { IrcCommandNameListBody } from './ircCommandNameListBodyClass.js';
import { IrcCommandNoop } from './ircCommandNoopClass.js';
import { IrcCommandQuit } from './ircCommandQuitClass.js';
import { IrcCommandWelcome } from './ircCommandWelcomeClass.js';

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

      case IrcKeyword.NameListBody: {
        return new IrcCommandNameListBody(this.banchoClient, packetParts);
      }

      case IrcKeyword.Quit: {
        return new IrcCommandQuit(this.banchoClient, packetParts);
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
