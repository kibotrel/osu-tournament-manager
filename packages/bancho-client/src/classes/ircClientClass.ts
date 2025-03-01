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

    this.on(BanchoClientEvent.Connected, () => {
      this.connectionState = IrcClientState.Connected;
    });
  }

  /**
   * Connect to the given IRC server, configure event listeners and send the
   * necessary messages to authenticate the user.
   */
  public connect() {
    const { host, port } = this.serverInformation;

    if (this.connectionState !== IrcClientState.Disconnected) {
      return;
    }

    this.socket = new Socket();

    this.socket.on(IrcEvent.Close, () => {
      this.handleCloseEvent();
    });

    this.socket.on(IrcEvent.Data, (packet) => {
      this.handleDataEvent(packet.toString().replaceAll('\r', ''));
    });

    this.socket.connect({ host, port }, () => {
      this.handleConnectEvent();
    });
  }

  /**
   * Gracefully disconnect from the IRC server.
   */
  public disconnect() {
    this.connectionState = IrcClientState.Disconnecting;

    this.sendIrcMessage(IrcKeyword.Quit);
  }

  private handleCloseEvent() {
    this.socket?.destroy();
    this.socket = undefined;
    this.connectionState = IrcClientState.Disconnected;
  }

  /**
   * Authenticate the user with the IRC Bancho server as stated in
   * [RFC 1459](https://datatracker.ietf.org/doc/html/rfc1459#section-4.19).
   */
  private handleConnectEvent() {
    const { username, password } = this.clientCredentials;

    this.connectionState = IrcClientState.Connecting;

    this.sendIrcMessage(`${IrcKeyword.Password} ${password}`);
    this.sendIrcMessage(`${IrcKeyword.Nickname} ${username}`);
    this.sendIrcMessage(`${IrcKeyword.Username} ${username} 0 * :${username}`);
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
    if (!isSocketReady(this.socket, this.connectionState)) {
      return;
    }

    this.socket.write(`${message}\r\n`);
  }
}
