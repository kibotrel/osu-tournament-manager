import { describe, expect, it, vi } from 'vitest';

import { BanchoClient } from '#src/classes/ircClientClass.js';

import { IrcCommandPart } from './ircCommandPartClass.js';

describe('IrcCommandPart', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
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
  });
});
