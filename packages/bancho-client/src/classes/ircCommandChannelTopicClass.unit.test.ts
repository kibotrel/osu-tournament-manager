import { describe, expect, it, vi } from 'vitest';

import { BanchoClient } from '#src/classes/ircClientClass.js';
import { IrcCommandChannelTopic } from '#src/classes/ircCommandChannelTopicClass.js';

describe('IrcCommandChannelTopic', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });
  const packetParts = ['localhost.dev 332 username #channel', 'Channel topic'];

  describe('constructor', () => {
    it('should create an instance of IrcCommandChannelTopic', () => {
      const command = new IrcCommandChannelTopic(banchoClient, packetParts);

      expect(command).toBeInstanceOf(IrcCommandChannelTopic);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });
  });

  describe('handleCommand', () => {
    it('should emit bot_joined_channel event with the channel name', () => {
      const command = new IrcCommandChannelTopic(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(2);
      expect(eventEmitter).toHaveBeenCalledWith('bot_joined_channel', {
        channel: '#channel',
      });
      expect(eventEmitter).toHaveBeenCalledWith('bot_joined_channel:#channel');
    });
  });
});
