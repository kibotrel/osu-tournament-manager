/* eslint-disable dot-notation */
import { describe, expect, it } from 'vitest';

import { BanchoClient } from '#src/classes/ircClientClass.js';
import { IrcCommandChannelNotFound } from '#src/classes/ircCommandChannelNotFoundClass.js';
import { IrcCommandChannelTopic } from '#src/classes/ircCommandChannelTopicClass.js';
import { IrcCommandFactory } from '#src/classes/ircCommandFactoryClass.js';
import { IrcCommandJoin } from '#src/classes/ircCommandJoinClass.js';
import { IrcCommandNameListBody } from '#src/classes/ircCommandNameListBodyClass.js';
import { IrcCommandNoop } from '#src/classes/ircCommandNoopClass.js';
import { IrcCommandPart } from '#src/classes/ircCommandPartClass.js';
import { IrcCommandPrivateMessage } from '#src/classes/ircCommandPrivateMessageClass.js';
import { IrcCommandQuit } from '#src/classes/ircCommandQuitClass.js';
import { IrcCommandRecipientNotFound } from '#src/classes/ircCommandRecipientNotFoundClass.js';
import { IrcCommandWelcome } from '#src/classes/ircCommandWelcomeClass.js';
import type { IrcKeyword } from '#src/constants/ircConstants.js';

describe('IrcCommandFactory', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });

  describe('constructor', () => {
    it('should create an instance of IrcCommandFactory', () => {
      const commandFactory = new IrcCommandFactory(banchoClient);

      expect(commandFactory).toBeInstanceOf(IrcCommandFactory);
      expect(commandFactory).toHaveProperty('banchoClient', banchoClient);
    });
  });

  describe('createCommandHandler', () => {
    const commandFactory = new IrcCommandFactory(banchoClient);

    it('should return an instance of IrcCommandChannelTopic if command is 332', () => {
      const packetParts = [
        'localhost.dev 332 username #channel',
        'Channel topic',
      ];
      const command = commandFactory.createCommandHandler(
        '332' as IrcKeyword,
        packetParts,
      );

      expect(command).toBeInstanceOf(IrcCommandChannelTopic);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });

    it('should return an instance of IrcCommandChannelNotFound if command is 403', () => {
      const packetParts = [
        'localhost.dev 403 username #unknown',
        'No such channel',
      ];
      const command = commandFactory.createCommandHandler(
        '403' as IrcKeyword,
        packetParts,
      );

      expect(command).toBeInstanceOf(IrcCommandChannelNotFound);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });

    it('should return an instance of IrcCommandJoin if command is JOIN', () => {
      const packetParts = ['username!server@localhost.dev JOIN', '#channel'];
      const command = commandFactory.createCommandHandler(
        'JOIN' as IrcKeyword,
        packetParts,
      );

      expect(command).toBeInstanceOf(IrcCommandJoin);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });

    it('should return an instance of IrcCommandNameListBody if command is 353', () => {
      const packetParts = [
        'localhost.dev 353 username = #channel',
        'username1 username2 username3',
      ];
      const command = commandFactory.createCommandHandler(
        '353' as IrcKeyword,
        packetParts,
      );

      expect(command).toBeInstanceOf(IrcCommandNameListBody);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });

    it('should return an instance of IrcCommandPart if command is PART', () => {
      const packetParts = ['username!server@localhost.dev PART', '#channel'];
      const command = commandFactory.createCommandHandler(
        'PART' as IrcKeyword,
        packetParts,
      );

      expect(command).toBeInstanceOf(IrcCommandPart);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });

    it('should return an instance of IrcCommandPrivateMessage if command is PRIVMSG', () => {
      const packetParts = [
        'username!server@localhost.dev PRIVMSG #channel',
        'message content',
      ];
      const command = commandFactory.createCommandHandler(
        'PRIVMSG' as IrcKeyword,
        packetParts,
      );

      expect(command).toBeInstanceOf(IrcCommandPrivateMessage);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });

    it('should return an instance of IrcCommandQuit if command is QUIT', () => {
      const packetParts = ['sername!server@localhost.dev QUIT', 'quit'];
      const command = commandFactory.createCommandHandler(
        'QUIT' as IrcKeyword,
        packetParts,
      );

      expect(command).toBeInstanceOf(IrcCommandQuit);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });

    it('should return an instance of IrcCommandRecipientNotFound if command is 401', () => {
      const packetParts = [
        'localhost.dev 401 username1 username2',
        'No such nick',
      ];
      const command = commandFactory.createCommandHandler(
        '401' as IrcKeyword,
        packetParts,
      );

      expect(command).toBeInstanceOf(IrcCommandRecipientNotFound);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });

    it('should return an instance of IrcCommandWelcome if command is 001', () => {
      const packetParts = ['localhost.dev 001 username', 'Welcome'];
      const command = commandFactory.createCommandHandler(
        '001' as IrcKeyword,
        packetParts,
      );

      expect(command).toBeInstanceOf(IrcCommandWelcome);
      expect(command).toHaveProperty('banchoClient', banchoClient);
    });

    it('should return an instance of IrcCommandNoop for unknown command', () => {
      const packetParts = ['localhost.dev UNKNOWN_COMMAND', 'unknown command'];
      const command = commandFactory.createCommandHandler(
        'UNKNOWN_COMMAND' as IrcKeyword,
        packetParts,
      );

      expect(command).toBeInstanceOf(IrcCommandNoop);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('command', 'UNKNOWN_COMMAND');
      expect(command).toHaveProperty('packetParts', packetParts);
    });
  });
});
