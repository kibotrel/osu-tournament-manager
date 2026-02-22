import type {
  BanchoTeamMode,
  BanchoWinCondition,
  OsuBeatmapModification,
} from '@packages/shared';

import { BanchoClientEvent } from '#src/banchoClient.export.js';
import type { BanchoClient } from '#src/classes/ircClient.class.js';
import type { IrcCommand } from '#src/classes/ircCommand.class.js';
import {
  BanchoBotCommonMessage,
  BanchoReadyStatus,
  BanchoTerm,
  BanchoUser,
} from '#src/constants/banchoClient.constants.js';
import { parseIrcUsername } from '#src/methods/parse.methods.js';

interface Payload {
  channel: string;
  message: string;
}

export class IrcCommandPrivateMessage implements IrcCommand {
  public readonly banchoClient: BanchoClient;
  public readonly packetParts: string[];
  private readonly banchoBotEvents: Array<{
    pattern: RegExp;
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
        pattern: new RegExp(BanchoBotCommonMessage.UserMovedSlot),
        handler: this.handleMultiplayerPlayerMovedSlotEvent.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.MatchAllPlayersReady),
        handler: this.handleMultiplayerChannelAllPlayersReadyEvent.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.InvitedUserToChannel),
        handler: this.handleUserInvitedToChannelEvent.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.UserJoinedSlot),
        handler: this.handleMultiplayerPlayerJoinedSlotEvent.bind(this),
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
        pattern: new RegExp(BanchoBotCommonMessage.UserLeftRoom),
        handler: this.handleMultiplayerPayerLeftRoomEvent.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.UserAlreadyInChannel),
        handler: this.handleUserAlreadyInChannelEvent.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.UserNotFound),
        handler: this.handleUserNotFoundEvent.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.MatchNewHost),
        handler: this.handleMultiplayerChannelHostChangedEvent.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.ClearHost),
        handler: this.handleMultiplayerChannelHostClearedEvent.bind(this),
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
        pattern: new RegExp(BanchoBotCommonMessage.ClosedMatch),
        handler: this.handleMultiplayerChannelClosedEvent.bind(this),
      },
      {
        pattern: new RegExp(BanchoBotCommonMessage.ConcurrentMatchLimitReached),
        handler: this.handleConcurrentMatchLimitReachedEvent.bind(this),
      },
    ];
  }

  private handleConcurrentMatchLimitReachedEvent() {
    this.banchoClient.emit(BanchoClientEvent.ConcurrentMatchLimitReached);
  }

  private handleMultiplayerChannelAllPlayersReadyEvent(payload: Payload) {
    const { channel } = payload;

    this.banchoClient.emit(
      BanchoClientEvent.MultiplayerChannelAllPlayersReady,
      { channel },
    );
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerChannelAllPlayersReady}:${channel}`,
    );
  }

  private handleMultiplayerChannelChangedBeatmap(payload: Payload) {
    const { channel, message } = payload;
    const match = new RegExp(BanchoBotCommonMessage.ChangedBeatmap).exec(
      message,
    );

    if (!match) {
      return;
    }

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
    const match = new RegExp(BanchoBotCommonMessage.MatchCreation).exec(
      message,
    );

    if (!match) {
      return;
    }

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

  private handleMultiplayerChannelHostChangedEvent(payload: Payload) {
    const { channel, message } = payload;
    const match = new RegExp(BanchoBotCommonMessage.MatchNewHost).exec(message);

    if (!match) {
      return;
    }

    const { user } = match.groups!;
    const data = { newHost: user };

    this.banchoClient.emit(BanchoClientEvent.MultiplayerChannelHostChanged, {
      ...data,
      channel,
    });
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerChannelHostChanged}:${channel}`,
      data,
    );
  }

  private handleMultiplayerChannelHostClearedEvent(payload: Payload) {
    const { channel } = payload;

    this.banchoClient.emit(BanchoClientEvent.MultiplayerChannelHostCleared, {
      channel,
    });
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerChannelHostCleared}:${channel}`,
    );
  }

  private handleMultiplayerChannelInformationConditionsEvent(payload: Payload) {
    const { channel, message } = payload;
    const match = new RegExp(BanchoBotCommonMessage.MatchConditions).exec(
      message,
    );

    if (!match) {
      return;
    }

    const { teamMode, winCondition } = match.groups!;
    const data = {
      teamMode: teamMode as BanchoTeamMode,
      winCondition: winCondition as BanchoWinCondition,
    };

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
    const match = new RegExp(BanchoBotCommonMessage.CurrentlyPlaying).exec(
      message,
    );

    if (!match) {
      return;
    }

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
    const match = new RegExp(
      BanchoBotCommonMessage.GlobalActiveModifications,
    ).exec(message);

    if (!match) {
      return;
    }

    const { modifications } = match.groups!;
    const data = {
      modifications: modifications
        .split(', ')
        .filter(Boolean) as OsuBeatmapModification[],
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
    const match = new RegExp(BanchoBotCommonMessage.RoomIdentification).exec(
      message,
    );

    if (!match) {
      return;
    }

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
    const match = new RegExp(BanchoBotCommonMessage.PlayerCount).exec(message);

    if (!match) {
      return;
    }

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
    const match = new RegExp(BanchoBotCommonMessage.MatchSlot).exec(message);

    if (!match) {
      return;
    }

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
        return modification !== BanchoTerm.Host;
      })
      .filter(Boolean);
    const data = {
      gameUserId: Number(gameUserId),
      isReady: status === BanchoReadyStatus.Ready,
      isHost: attributes.startsWith(BanchoTerm.Host),
      slotNumber: Number(slotNumber),
      user,
      modifications: modifications as OsuBeatmapModification[],
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
    const match = new RegExp(BanchoBotCommonMessage.RoomNameUpdated).exec(
      message,
    );

    if (!match) {
      return;
    }

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

  private handleMultiplayerPlayerJoinedSlotEvent(payload: Payload) {
    const { channel, message } = payload;
    const match = new RegExp(BanchoBotCommonMessage.UserJoinedSlot).exec(
      message,
    );

    if (!match) {
      return;
    }

    const { user, slotNumber } = match.groups!;
    const data = { user, slotNumber: Number(slotNumber) };

    this.banchoClient.emit(BanchoClientEvent.MultiplayerPlayerJoinedSlot, {
      ...data,
      channel,
    });
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerPlayerJoinedSlot}:${channel}`,
      data,
    );
  }

  private handleMultiplayerPayerLeftRoomEvent(payload: Payload) {
    const { channel, message } = payload;
    const match = new RegExp(BanchoBotCommonMessage.UserLeftRoom).exec(message);

    if (!match) {
      return;
    }

    const { user } = match.groups!;
    const data = { user };

    this.banchoClient.emit(BanchoClientEvent.MultiplayerPayerLeftRoom, {
      ...data,
      channel,
    });
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerPayerLeftRoom}:${channel}`,
      data,
    );
  }

  private handleMultiplayerPlayerMovedSlotEvent(payload: Payload) {
    const { channel, message } = payload;
    const match = new RegExp(BanchoBotCommonMessage.UserMovedSlot).exec(
      message,
    );

    if (!match) {
      return;
    }

    const { user, slotNumber } = match.groups!;
    const data = { user, slotNumber: Number(slotNumber) };

    this.banchoClient.emit(BanchoClientEvent.MultiplayerPlayerMovedSlot, {
      ...data,
      channel,
    });
    this.banchoClient.emit(
      `${BanchoClientEvent.MultiplayerPlayerMovedSlot}:${channel}`,
      data,
    );
  }

  private handleUserAlreadyInChannelEvent() {
    this.banchoClient.emit(BanchoClientEvent.UserAlreadyInChannel);
  }

  private handleUserInvitedToChannelEvent(payload: Payload) {
    const { channel, message } = payload;
    const match = new RegExp(BanchoBotCommonMessage.InvitedUserToChannel).exec(
      message,
    );

    if (!match) {
      return;
    }

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
      if (pattern.test(message)) {
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
