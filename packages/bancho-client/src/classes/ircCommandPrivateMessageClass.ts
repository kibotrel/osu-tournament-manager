import { BanchoClientEvent } from '#src/banchoClientExport.js';
import type { BanchoClient } from '#src/classes/ircClientClass.js';
import type { IrcCommand } from '#src/classes/ircCommandClass.js';
import {
  BanchoBotCommonMessage,
  BanchoReadyStatus,
  BanchoTerm,
  BanchoUser,
} from '#src/constants/banchoClientConstants.js';
import { parseIrcUsername } from '#src/methods/parseMethods.js';

interface Payload {
  channel: string;
  message: string;
}

export class IrcCommandPrivateMessage implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];
  private readonly banchoBotEvents: Array<{
    pattern: RegExp | string;
    handler: (payload: Payload) => void;
  }> = [];

  constructor(banchoClient: BanchoClient, packetParts: string[]) {
    this.banchoClient = banchoClient;
    this.packetParts = packetParts;
    this.banchoBotEvents = [
      {
        pattern: new RegExp(BanchoBotCommonMessage.ChangedBeatmap),
        handler: this.handleMultiplayerChannelChangedBeatmap.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.InvitedUserToChannel),
        handler: this.handleUserInvitedToChannelEvent.bind(this),
      },
      {
        pattern: BanchoBotCommonMessage.UserNotFound,
        handler: this.handleUserNotFoundEvent.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.RoomIdentification),
        handler:
          this.handleMultiplayerChannelInformationIdentityEvent.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.CurrentlyPlaying),
        handler:
          this.handleMultiplayerChannelInformationCurrentlyPlayingEvent.bind(
            this,
          ),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.MatchConditions),
        handler:
          this.handleMultiplayerChannelInformationConditionsEvent.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.GlobalActiveModifications),
        handler:
          this.handleMultiplayerChannelInformationGlobalModificationsEvent.bind(
            this,
          ),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.PlayerCount),
        handler:
          this.handleMultiplayerChannelInformationPlayerCountEvent.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.MatchSlot),
        handler: this.handleMultiplayerChannelInformationSlotEvent.bind(this),
      },
      {
        pattern: BanchoBotCommonMessage.UserAlreadyInChannel,
        handler: this.handleUserAlreadyInChannelEvent.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.RoomNameUpdated),
        handler: this.handleMultiplayerChannelNameUpdated.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.MatchCreation),
        handler: this.handleMultiplayerChannelCreation.bind(this),
      },
      {
        pattern: BanchoBotCommonMessage.ClosedMatch,
        handler: this.handleMultiplayerChannelClosedEvent.bind(this),
      },
      {
        pattern: BanchoBotCommonMessage.ConcurrentMatchLimitReached,
        handler: this.handleConcurrentMatchLimitReachedEvent.bind(this),
      },
    ];
  }

  private handleConcurrentMatchLimitReachedEvent() {
    this.banchoClient.emit(BanchoClientEvent.ConcurrentMatchLimitReached);
  }

  private handleMultiplayerChannelChangedBeatmap(payload: Payload) {
    const { channel, message } = payload;
    const match = message.match(BanchoBotCommonMessage.ChangedBeatmap)!;
    const { beatmap, url } = match.groups!;
    const data = { beatmap, url };

    this.banchoClient.emit(
      BanchoClientEvent.MultiplayerChannelInformationCurrentlyPlaying,
      { ...data, channel },
    );
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerChannelInformationCurrentlyPlaying}:${channel}`,
      data,
    );
  }

  private handleMultiplayerChannelClosedEvent(payload: Payload) {
    const { channel } = payload;

    this.banchoClient.emit(BanchoClientEvent.MultiplayerChannelClosed, {
      channel,
    });
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerChannelClosed}:${channel}`,
    );
  }

  private handleMultiplayerChannelCreation(payload: Payload) {
    const { message } = payload;
    const match = message.match(BanchoBotCommonMessage.MatchCreation)!;
    const { historyUrl, name } = match.groups!;
    const data = { historyUrl, name };
    const channel = `#mp_${historyUrl.split('/').at(-1)!}`;

    this.banchoClient.emit(
      BanchoClientEvent.MultiplayerChannelInformationIdentity,
      { ...data, channel },
    );
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerChannelInformationIdentity}:${channel}`,
      data,
    );
  }

  private handleMultiplayerChannelInformationConditionsEvent(payload: Payload) {
    const { channel, message } = payload;
    const match = message.match(BanchoBotCommonMessage.MatchConditions)!;
    const { teamMode, winCondition } = match.groups!;
    const data = { teamMode, winCondition };

    this.banchoClient.emit(
      BanchoClientEvent.MultiplayerChannelInformationConditions,
      { ...data, channel },
    );
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerChannelInformationConditions}:${channel}`,
      data,
    );
  }

  private handleMultiplayerChannelInformationCurrentlyPlayingEvent(
    payload: Payload,
  ) {
    const { channel, message } = payload;
    const match = message.match(BanchoBotCommonMessage.CurrentlyPlaying)!;
    const { beatmap, url } = match.groups!;
    const data = { beatmap, url };

    this.banchoClient.emit(
      BanchoClientEvent.MultiplayerChannelInformationCurrentlyPlaying,
      { ...data, channel },
    );
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerChannelInformationCurrentlyPlaying}:${channel}`,
      data,
    );
  }

  private handleMultiplayerChannelInformationGlobalModificationsEvent(
    payload: Payload,
  ) {
    const { channel, message } = payload;
    const match = message.match(
      BanchoBotCommonMessage.GlobalActiveModifications,
    )!;
    const { modifications } = match.groups!;
    const data = {
      modifications: modifications.split(', ').filter(Boolean),
    };

    this.banchoClient.emit(
      BanchoClientEvent.MultiplayerChannelInformationGlobalModifications,
      { ...data, channel },
    );
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerChannelInformationGlobalModifications}:${channel}`,
      data,
    );
  }

  private handleMultiplayerChannelInformationIdentityEvent(payload: Payload) {
    const { channel, message } = payload;
    const match = message.match(BanchoBotCommonMessage.RoomIdentification)!;
    const { historyUrl, name } = match.groups!;
    const data = { historyUrl, name };

    this.banchoClient.emit(
      BanchoClientEvent.MultiplayerChannelInformationIdentity,
      { ...data, channel },
    );
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerChannelInformationIdentity}:${channel}`,
      data,
    );
  }

  private handleMultiplayerChannelInformationPlayerCountEvent(
    payload: Payload,
  ) {
    const { channel, message } = payload;
    const match = message.match(BanchoBotCommonMessage.PlayerCount)!;
    const { playerCount } = match.groups!;
    const data = { playerCount: Number(playerCount) };

    this.banchoClient.emit(
      BanchoClientEvent.MultiplayerChannelInformationPlayerCount,
      { ...data, channel },
    );
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerChannelInformationPlayerCount}:${channel}`,
      data,
    );
  }

  private handleMultiplayerChannelInformationSlotEvent(payload: Payload) {
    const { channel, message } = payload;
    const match = message.match(BanchoBotCommonMessage.MatchSlot)!;
    const {
      attributes = '',
      gameUserId,
      slotNumber,
      status,
      user,
    } = match.groups!;
    const modifications = attributes
      .slice(attributes.indexOf('/') + 1)
      .trim()
      .split(', ')
      .filter((modification) => {
        return modification && modification !== BanchoTerm.Host;
      });
    const data = {
      gameUserId: Number(gameUserId),
      isReady: status === BanchoReadyStatus.Ready,
      isHost: attributes.startsWith(BanchoTerm.Host),
      slotNumber: Number(slotNumber),
      user,
      modifications,
    };

    this.banchoClient.emit(
      BanchoClientEvent.MultiplayerChannelInformationSlot,
      { ...data, channel },
    );
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerChannelInformationSlot}:${channel}`,
      data,
    );
  }

  private handleMultiplayerChannelNameUpdated(payload: Payload) {
    const { channel, message } = payload;
    const match = message.match(BanchoBotCommonMessage.RoomNameUpdated)!;
    const { name } = match.groups!;
    const data = { name };

    this.banchoClient.emit(BanchoClientEvent.MultiplayerChannelNameUpdated, {
      ...data,
      channel,
    });
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerChannelNameUpdated}:${channel}`,
      data,
    );
  }

  private handleUserAlreadyInChannelEvent() {
    this.banchoClient.emit(BanchoClientEvent.UserAlreadyInChannel);
  }

  private handleUserInvitedToChannelEvent(payload: Payload) {
    const { channel, message } = payload;
    const match = message.match(BanchoBotCommonMessage.InvitedUserToChannel)!;
    const { user } = match.groups!;

    this.banchoClient.emit(BanchoClientEvent.UserInvitedToChannel, {
      channel,
      user,
    });
    this.banchoClient.emit(
      `${BanchoClientEvent.UserInvitedToChannel}:${channel}:${user}`,
    );
  }

  private handleUserNotFoundEvent() {
    this.banchoClient.emit(BanchoClientEvent.UserNotFound);
  }

  private emitBanchoBotEvents(channel: string, message: string) {
    for (const { pattern, handler } of this.banchoBotEvents) {
      if (
        typeof pattern === 'string'
          ? message === pattern
          : pattern.test(message)
      ) {
        return handler({ channel, message });
      }
    }
  }

  public handleCommand() {
    const [username, , channel] = this.packetParts.at(0)!.split(' ');
    const message = this.packetParts.slice(1).join(':');
    const user = parseIrcUsername(username.split('!').at(0)!);

    this.banchoClient.emit(BanchoClientEvent.ChannelMessage, {
      channel,
      /* eslint-disable-next-line no-control-regex, unicorn/no-hex-escape */
      message: message.replace(/\x01$/, ''),
      user,
    });
    this.banchoClient.emit(`${BanchoClientEvent.ChannelMessage}:${channel}`, {
      /* eslint-disable-next-line no-control-regex, unicorn/no-hex-escape */
      message: message.replace(/\x01$/, ''),
      user,
    });

    if (user === BanchoUser.BanchoBot) {
      this.emitBanchoBotEvents(channel, message);
    }
  }
}
