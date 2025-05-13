import { describe, expect, it, vi } from 'vitest';

import { BanchoClient } from '#src/classes/ircClientClass.js';

import { IrcCommandPrivateMessage } from './ircCommandPrivateMessageClass.js';

describe('IrcCommandPrivateMessage', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });

  describe('constructor', () => {
    it('should create an instance of IrcCommandPrivateMessage', () => {
      const packetParts = [
        'username!server@localhost.dev PRIVMSG #channel',
        'message content',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);

      expect(command).toBeInstanceOf(IrcCommandPrivateMessage);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });
  });

  describe('handleCommand', () => {
    it('should emit channel_message event with the channel, message and user', () => {
      const packetParts = [
        'username!server@localhost.dev PRIVMSG #channel',
        'message content',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(2);
      expect(eventEmitter).toHaveBeenCalledWith('channel_message', {
        channel: '#channel',
        message: 'message content',
        user: 'username',
      });
      expect(eventEmitter).toHaveBeenCalledWith('channel_message:#channel', {
        message: 'message content',
        user: 'username',
      });
    });

    it('should also emit an internal user_invited_to_channel event if sender is BanchoBot and received message is an multiplayer match invitation', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Invited username to the room',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith('user_invited_to_channel', {
        channel: '#channel',
        user: 'username',
      });
      expect(eventEmitter).toHaveBeenCalledWith(
        'user_invited_to_channel:#channel:username',
      );
    });

    it('should also emit an internal multiplayer_channel_closed event if sender is BanchoBot and received message is a multiplayer match closing notice', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Closed the match',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith('multiplayer_channel_closed', {
        channel: '#channel',
      });
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_closed:#channel',
      );
    });

    it('should also emit an internal user_not_found event if sender is BanchoBot and received message is a user not found notice', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'User not found',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(3);
      expect(eventEmitter).toHaveBeenCalledWith('user_not_found');
    });

    it('should also emit an internal user_already_in_channel event if sender is BanchoBot and received message is indicating that the user is already in the channel', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'User is already in the room',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(3);
      expect(eventEmitter).toHaveBeenCalledWith('user_already_in_channel');
    });
  });
});
