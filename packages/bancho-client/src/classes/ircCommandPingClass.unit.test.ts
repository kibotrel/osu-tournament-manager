import { describe, expect, it, vi } from 'vitest';

import { BanchoClient } from '#src/classes/ircClientClass.js';

import { IrcCommandPing } from './ircCommandPingClass.js';

describe('IrcCommandPing', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });

  describe('constructor', () => {
    it('should create an instance of IrcCommandPing', () => {
      const command = new IrcCommandPing(banchoClient);

      expect(command).toBeInstanceOf(IrcCommandPing);
      expect(command).toHaveProperty('banchoClient', banchoClient);
    });
  });

  describe('handleCommand', () => {
    it('should send back a PONG message to the server', async () => {
      const command = new IrcCommandPing(banchoClient);

      command.banchoClient.sendIrcMessage = vi.fn();

      await command.handleCommand();

      expect(command.banchoClient.sendIrcMessage).toHaveBeenCalledOnce();
      expect(command.banchoClient.sendIrcMessage).toHaveBeenCalledWith(
        `PONG localhost.dev`,
      );
    });
  });
});
