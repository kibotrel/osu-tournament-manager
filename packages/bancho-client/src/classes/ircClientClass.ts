import { EventEmitter } from 'node:events';
import { Socket } from 'node:net';

import {
  BanchoClientEvent,
  BanchoCommand,
  BanchoPublicChannel,
} from '#src/constants/banchoClientConstants.js';
import {
  IrcClientState,
  IrcEvent,
  IrcKeyword,
} from '#src/constants/ircConstants.js';
import {
  parseIrcMessage,
  parseOsuUsername,
} from '#src/methods/parseMethods.js';
import {
  isDirectMessageChannel,
  isSocketReady,
} from '#src/methods/typeGardMethods.js';

interface EmittedEvents {
  [BanchoClientEvent.AddChannelMembers]: [{ channel: string; users: string[] }];
  [BanchoClientEvent.BotConnected]: [];
  [BanchoClientEvent.BotDisconnected]: [];
  [BanchoClientEvent.BotJoinedChannel]: [{ channel: string }];
  [BanchoClientEvent.BotSentMessage]: [{ error?: Error; message: string }];
  [BanchoClientEvent.ChannelMessage]: [
    { channel: string; message: string; user: string },
  ];
  [BanchoClientEvent.ChannelNotFound]: [{ channel: string }];
  [BanchoClientEvent.ConcurrentMatchLimitReached]: [];
  [BanchoClientEvent.MultiplayerChannelAllPlayersReady]: [{ channel: string }];
  [BanchoClientEvent.MultiplayerChannelClosed]: [{ channel: string }];
  [BanchoClientEvent.MultiplayerChannelHostChanged]: [
    { channel: string; newHost: string },
  ];
  [BanchoClientEvent.MultiplayerChannelInformationConditions]: [
    { channel: string; teamMode: string; winCondition: string },
  ];
  [BanchoClientEvent.MultiplayerChannelInformationCurrentlyPlaying]: [
    { beatmap: string; channel: string; url: string },
  ];
  [BanchoClientEvent.MultiplayerChannelInformationGlobalModifications]: [
    { channel: string; modifications: string[] },
  ];
  [BanchoClientEvent.MultiplayerChannelInformationIdentity]: [
    { channel: string; historyUrl: string; name: string },
  ];
  [BanchoClientEvent.MultiplayerChannelInformationPlayerCount]: [
    { channel: string; playerCount: number },
  ];
  [BanchoClientEvent.MultiplayerChannelInformationSlot]: [
    {
      channel: string;
      gameUserId: number;
      isHost: boolean;
      isReady: boolean;
      modifications: string[];
      slotNumber: number;
      user: string;
    },
  ];
  [BanchoClientEvent.MultiplayerChannelNameUpdated]: [
    { channel: string; name: string },
  ];
  [BanchoClientEvent.MultiplayerPlayerJoinedSlot]: [
    { channel: string; user: string; slotNumber: number },
  ];
  [BanchoClientEvent.MultiplayerPayerLeftRoom]: [
    { channel: string; user: string },
  ];
  [BanchoClientEvent.MultiplayerPlayerMovedSlot]: [
    { channel: string; user: string; slotNumber: number },
  ];
  [BanchoClientEvent.RecipientNotFound]: [{ recipient: string }];
  [BanchoClientEvent.UserAlreadyInChannel]: [];
  [BanchoClientEvent.UserDisconnected]: [{ user: string }];
  [BanchoClientEvent.UserInvitedToChannel]: [{ channel: string; user: string }];
  [BanchoClientEvent.UserJoinedChannel]: [{ channel: string; user: string }];
  [BanchoClientEvent.UserLeftChannel]: [{ channel: string; user: string }];
  [BanchoClientEvent.UserNotFound]: [];
  [key: `${BanchoClientEvent.BotJoinedChannel}:${string}`]: [];
  [key: `${BanchoClientEvent.ChannelMessage}:${string}`]: [
    { message: string; user: string },
  ];
  [key: `${BanchoClientEvent.ChannelNotFound}:${string}`]: [];
  [key: `${BanchoClientEvent.MultiplayerChannelAllPlayersReady}:${string}`]: [];
  [key: `${BanchoClientEvent.MultiplayerChannelClosed}:${string}`]: [];
  [key: `${BanchoClientEvent.MultiplayerChannelHostChanged}:${string}`]: [
    { newHost: string },
  ];
  [
    key: `${BanchoClientEvent.MultiplayerChannelInformationConditions}:${string}`
  ]: [{ teamMode: string; winCondition: string }];
  [
    key: `${BanchoClientEvent.MultiplayerChannelInformationCurrentlyPlaying}:${string}`
  ]: [{ beatmap: string; url: string }];
  [
    key: `${BanchoClientEvent.MultiplayerChannelInformationGlobalModifications}:${string}`
  ]: [{ modifications: string[] }];
  [
    key: `${BanchoClientEvent.MultiplayerChannelInformationIdentity}:${string}`
  ]: [{ historyUrl: string; name: string }];
  [
    key: `${BanchoClientEvent.MultiplayerChannelInformationPlayerCount}:${string}`
  ]: [{ playerCount: number }];
  [key: `${BanchoClientEvent.MultiplayerChannelInformationSlot}:${string}`]: [
    {
      gameUserId: number;
      isHost: boolean;
      isReady: boolean;
      modifications: string[];
      slotNumber: number;
      user: string;
    },
  ];
  [key: `${BanchoClientEvent.MultiplayerChannelNameUpdated}:${string}`]: [
    { name: string },
  ];
  [key: `${BanchoClientEvent.MultiplayerPlayerJoinedSlot}:${string}`]: [
    { user: string; slotNumber: number },
  ];
  [key: `${BanchoClientEvent.MultiplayerPayerLeftRoom}:${string}`]: [
    { user: string },
  ];
  [key: `${BanchoClientEvent.MultiplayerPlayerMovedSlot}:${string}`]: [
    { user: string; slotNumber: number },
  ];
  [key: `${BanchoClientEvent.RecipientNotFound}:${string}`]: [];
  [key: `${BanchoClientEvent.UserInvitedToChannel}:${string}:${string}`]: [];
  [key: `${BanchoClientEvent.UserJoinedChannel}:${string}`]: [{ user: string }];
  [key: `${BanchoClientEvent.UserLeftChannel}:${string}`]: [{ user: string }];
}

export interface IrcClientCredentials {
  username: string;
  password: string;
}

export interface IrcClientOptions {
  clientCredentials: IrcClientCredentials;
  serverInformation: IrcServerInformation;
}

export interface IrcServerInformation {
  host: string;
  port: number;
}

export class BanchoClient extends EventEmitter<EmittedEvents> {
  private readonly clientCredentials: IrcClientCredentials;
  public readonly serverInformation: IrcServerInformation;
  private connectionState: IrcClientState;
  /**
   * This is necessary due to the fact that the IRC protocol does not guarantee
   * that a packet will be terminated with a complete message. If this happens,
   * last full message will be processed when the next packet is received.
   */
  private remainingPacketData: string;
  private socket: Socket | undefined;

  constructor(options: IrcClientOptions) {
    super();

    const { clientCredentials, serverInformation } = options;

    this.clientCredentials = clientCredentials;
    this.connectionState = IrcClientState.Disconnected;
    this.serverInformation = serverInformation;
    this.socket = undefined;
    this.remainingPacketData = '';

    this.once(BanchoClientEvent.BotConnected, () => {
      this.connectionState = IrcClientState.Connected;
    });
  }

  public closeMultiplayerChannel(channel: string) {
    return new Promise<void>((resolve, reject) => {
      this.once(`${BanchoClientEvent.RecipientNotFound}:${channel}`, () => {
        return reject(new Error(`Match channel ${channel} not found`));
      });

      this.once(
        `${BanchoClientEvent.MultiplayerChannelClosed}:${channel}`,
        () => {
          return resolve();
        },
      );

      this.sendPrivateMessage(BanchoCommand.CloseMatch, {
        recipient: channel,
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  /**
   * Connect to the given IRC server, configure event listeners and send the
   * necessary messages to authenticate the user.
   */
  public connect() {
    return new Promise<void>((resolve, reject) => {
      const { host, port } = this.serverInformation;

      if (this.connectionState !== IrcClientState.Disconnected) {
        return reject(new Error('Bancho client is already connected'));
      }

      this.socket = new Socket();

      this.socket.once(IrcEvent.Close, () => {
        this.handleCloseEvent();
      });

      this.socket.on(IrcEvent.Data, (packet) => {
        this.handleDataEvent(packet.toString().replaceAll('\r', ''));
      });

      this.once(BanchoClientEvent.BotConnected, () => {
        return resolve();
      });

      this.socket.connect({ host, port }, () => {
        this.handleConnectEvent().catch((error) => {
          this.handleCloseEvent();

          return reject(error);
        });
      });
    });
  }

  /**
   * Create a new multiplayer channel with the given name. Returns the internal
   * id given by the Bancho server like `#mp_123456`.
   */
  public createMultiplayerChannel(name: string) {
    return new Promise<string>((resolve, reject) => {
      this.once(BanchoClientEvent.BotJoinedChannel, ({ channel }) => {
        resolve(channel);
      });

      this.sendPrivateMessage(
        `${BanchoCommand.CreateTournamentMatch} ${name}`,
        { recipient: BanchoPublicChannel.Lobby },
      ).catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * Gracefully disconnect from the IRC server.
   */
  public disconnect() {
    return new Promise<void>((resolve, reject) => {
      if (this.connectionState === IrcClientState.Disconnected) {
        return reject(new Error('Bancho client is already disconnected'));
      }

      this.once(BanchoClientEvent.BotDisconnected, () => {
        return resolve();
      });

      if (this.connectionState !== IrcClientState.Disconnecting) {
        this.sendIrcMessage(IrcKeyword.Quit).catch(() => {
          this.handleCloseEvent();

          return resolve();
        });
        this.connectionState = IrcClientState.Disconnecting;
      }
    });
  }

  private handleCloseEvent() {
    this.socket?.destroy();
    this.socket = undefined;
    this.connectionState = IrcClientState.Disconnected;
    this.emit(BanchoClientEvent.BotDisconnected);
  }

  /**
   * Authenticate the user with the IRC Bancho server as stated in
   * [RFC 1459](https://datatracker.ietf.org/doc/html/rfc1459#section-4.19).
   */
  private async handleConnectEvent() {
    const { username, password } = this.clientCredentials;

    this.connectionState = IrcClientState.Connecting;

    await this.sendIrcMessage(`${IrcKeyword.Password} ${password}`);
    await this.sendIrcMessage(`${IrcKeyword.Nickname} ${username}`);
    await this.sendIrcMessage(
      `${IrcKeyword.Username} ${username} 0 * :${username}`,
    );
  }

  private async handleDataEvent(packet: string) {
    this.remainingPacketData += packet;

    const messages = this.remainingPacketData.split('\n');

    this.remainingPacketData = messages.pop() ?? '';

    for (const message of messages) {
      const ircCommand = parseIrcMessage(this, message);

      if (!ircCommand) {
        continue;
      }

      await ircCommand.handleCommand();
    }
  }

  public joinChannel(channel: string) {
    return new Promise<void>((resolve, reject) => {
      this.once(`${BanchoClientEvent.BotJoinedChannel}:${channel}`, () => {
        return resolve();
      });

      this.once(`${BanchoClientEvent.ChannelNotFound}:${channel}`, () => {
        return reject(new Error(`Bancho channel ${channel} not found`));
      });

      this.sendIrcMessage(`${IrcKeyword.Join} ${channel}`).catch((error) => {
        return reject(error);
      });
    });
  }

  /**
   * [RFC 1459](https://datatracker.ietf.org/doc/html/rfc1459#section-2.3.1) compliant
   * method to send a message to an IRC server.
   */
  public sendIrcMessage(message: string) {
    return new Promise<void>((resolve, reject) => {
      if (!isSocketReady(this.connectionState, this.socket)) {
        return reject(new Error('Bancho client is not connected'));
      }

      this.once(BanchoClientEvent.BotSentMessage, ({ error }) => {
        if (error) {
          return reject(error);
        }

        return resolve();
      });

      this.socket.write(`${message}\r\n`, (error) => {
        if (error) {
          this.emit(BanchoClientEvent.BotSentMessage, { error, message });

          return;
        }

        this.emit(BanchoClientEvent.BotSentMessage, { message });
      });
    });
  }

  public inviteUserToMultiplayerChannel(username: string, channel: string) {
    const user = parseOsuUsername(username);

    return new Promise<void>((resolve, reject) => {
      this.once(BanchoClientEvent.UserNotFound, () => {
        return reject(
          new Error(`Could not invite user ${user} to channel ${channel}`),
        );
      });

      this.once(BanchoClientEvent.UserAlreadyInChannel, () => {
        return resolve();
      });

      this.once(
        `${BanchoClientEvent.UserInvitedToChannel}:${channel}:${user}`,
        () => {
          return resolve();
        },
      );

      this.sendPrivateMessage(`${BanchoCommand.InvitePlayer} ${user}`, {
        recipient: channel,
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  /**
   * Send a private message to the given recipient (channel or user).
   */
  public async sendPrivateMessage(
    message: string,
    options: { recipient: string },
  ) {
    const { recipient } = options;

    if (isDirectMessageChannel(recipient)) {
      await this.sendIrcMessage(
        `${IrcKeyword.PrivateMessage} ${parseOsuUsername(recipient)} :${message}`,
      );

      return;
    }

    await this.sendIrcMessage(
      `${IrcKeyword.PrivateMessage} ${recipient} :${message}`,
    );
  }

  public get username(): string {
    return this.clientCredentials.username;
  }
}
