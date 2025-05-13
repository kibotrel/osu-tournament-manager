import { describe, expect, it, vi } from 'vitest';

import { BanchoClient } from '#src/classes/ircClientClass.js';
import { IrcCommandJoin } from '#src/classes/ircCommandJoinClass.js';

describe('IrcCommandJoin', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });
  const packetParts = ['username!server@localhost.dev JOIN', '#channel'];

  describe('constructor', () => {
    it('should create an instance of IrcCommandJoin', () => {
      const command = new IrcCommandJoin(banchoClient, packetParts);

      expect(command).toBeInstanceOf(IrcCommandJoin);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });
  });

  describe('handleCommand', () => {
    it('should emit user_joined_channel event with the channel name and user', () => {
      const command = new IrcCommandJoin(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(2);
      expect(eventEmitter).toHaveBeenCalledWith('user_joined_channel', {
        channel: '#channel',
        user: 'username',
      });
      expect(eventEmitter).toHaveBeenCalledWith(
        'user_joined_channel:#channel',
        { user: 'username' },
      );
    });
  });
});
