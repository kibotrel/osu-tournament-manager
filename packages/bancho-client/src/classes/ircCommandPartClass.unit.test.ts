import { describe, expect, it, vi } from 'vitest';

import { BanchoClient } from '#src/classes/ircClientClass.js';
import { IrcCommandPart } from '#src/classes/ircCommandPartClass.js';

describe('IrcCommandPart', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'bot', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });
  const packetParts = ['username!server@localhost.dev PART', '#channel'];

  describe('constructor', () => {
    it('should create an instance of IrcCommandPart', () => {
      const command = new IrcCommandPart(banchoClient, packetParts);

      expect(command).toBeInstanceOf(IrcCommandPart);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });
  });

  describe('handleCommand', () => {
    it('should emit user_left_channel event with the channel and user', () => {
      const command = new IrcCommandPart(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(2);
      expect(eventEmitter).toHaveBeenCalledWith('user_left_channel', {
        channel: '#channel',
        user: 'username',
      });
      expect(eventEmitter).toHaveBeenCalledWith('user_left_channel:#channel', {
        user: 'username',
      });
    });

    it('should emit multiplayer_channel_closed as well if user is this client user', () => {
      const packetParts = ['bot!server@localhost.dev PART', '#channel'];
      const command = new IrcCommandPart(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith('user_left_channel', {
        channel: '#channel',
        user: 'bot',
      });
      expect(eventEmitter).toHaveBeenCalledWith('user_left_channel:#channel', {
        user: 'bot',
      });
      expect(eventEmitter).toHaveBeenCalledWith('multiplayer_channel_closed', {
        channel: '#channel',
      });
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_closed:#channel',
      );
    });
  });
});
