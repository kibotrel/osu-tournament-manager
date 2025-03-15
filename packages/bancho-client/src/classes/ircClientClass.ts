import { EventEmitter } from 'node:events';
import { Socket } from 'node:net';

import { BanchoClientEvent } from '#src/constants/banchoClientConstants.js';
import {
  IrcClientState,
  IrcEvent,
  IrcKeyword,
} from '#src/constants/ircConstants.js';
import { parseIrcMessage } from '#src/methods/parseMethods.js';
import { isSocketReady } from '#src/methods/typeGardMethods.js';

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

export class BanchoClient extends EventEmitter {
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

  /**
   * Connect to the given IRC server, configure event listeners and send the
   * necessary messages to authenticate the user.
   */
  public connect() {
    return new Promise<void>((resolve) => {
      const { host, port } = this.serverInformation;

      if (this.connectionState !== IrcClientState.Disconnected) {
        return resolve();
      }

      this.socket = new Socket();

      this.socket.once(IrcEvent.Close, () => {
        this.handleCloseEvent();
      });

      this.socket.on(IrcEvent.Data, (packet) => {
        this.handleDataEvent(packet.toString().replaceAll('\r', ''));
      });

      this.once(BanchoClientEvent.BotConnected, () => {
        resolve();
      });

      this.socket.connect({ host, port }, () => {
        this.handleConnectEvent();
      });
    });
  }

  /**
   * Gracefully disconnect from the IRC server.
   */
  public disconnect() {
    return new Promise<void>((resolve) => {
      if (this.connectionState === IrcClientState.Disconnected) {
        return resolve();
      }

      this.once(BanchoClientEvent.BotDisconnected, () => {
        resolve();
      });

      this.sendIrcMessage(IrcKeyword.Quit);
      this.connectionState = IrcClientState.Disconnecting;
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

  /**
   * [RFC 1459](https://datatracker.ietf.org/doc/html/rfc1459#section-2.3.1) compliant
   * method to send a message to an IRC server.
   */
  public sendIrcMessage(message: string) {
    return new Promise<void>((resolve, reject) => {
      if (!isSocketReady(this.socket, this.connectionState)) {
        return resolve();
      }

      this.once(BanchoClientEvent.BotSentMessage, ({ error }) => {
        if (error) {
          return reject(error);
        }

        resolve();
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
}
