import { describe, expect, it, vi } from 'vitest';

import { BanchoClient } from '#src/classes/ircClient.class.js';
import { IrcCommandChannelNotFound } from '#src/classes/ircCommandChannelNotFound.class.js';

describe('IrcCommandChannelNotFound', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });
  const packetParts = [
    'localhost.dev 403 username #unknown',
    'No such channel',
  ];

  describe('constructor', () => {
    it('should create an instance of IrcCommandChannelNotFound', () => {
      const command = new IrcCommandChannelNotFound(banchoClient, packetParts);

      expect(command).toBeInstanceOf(IrcCommandChannelNotFound);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });
  });

  describe('handleCommand', () => {
    it('should emit channel_not_found event with the channel name', () => {
      const command = new IrcCommandChannelNotFound(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(2);
      expect(eventEmitter).toHaveBeenCalledWith('channel_not_found', {
        channel: '#unknown',
      });
      expect(eventEmitter).toHaveBeenCalledWith('channel_not_found:#unknown');
    });
  });
});
