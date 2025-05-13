import { describe, expect, it, vi } from 'vitest';

import { BanchoClient } from '#src/classes/ircClientClass.js';
import { IrcCommandNameListBody } from '#src/classes/ircCommandNameListBodyClass.js';

describe('IrcCommandNameListBody', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });
  const packetParts = [
    'localhost.dev 353 username = #channel',
    'username1 username2 username3',
  ];

  describe('constructor', () => {
    it('should create an instance of IrcCommandNameListBody', () => {
      const command = new IrcCommandNameListBody(banchoClient, packetParts);

      expect(command).toBeInstanceOf(IrcCommandNameListBody);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });
  });

  describe('handleCommand', () => {
    it('should emit add_channel_members event with the channel name and an user list', () => {
      const command = new IrcCommandNameListBody(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledOnce();
      expect(eventEmitter).toHaveBeenCalledWith('add_channel_members', {
        channel: '#channel',
        users: ['username1', 'username2', 'username3'],
      });
    });
  });
});
