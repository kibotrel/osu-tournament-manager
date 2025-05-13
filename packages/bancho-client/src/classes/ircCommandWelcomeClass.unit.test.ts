import { describe, expect, it, vi } from 'vitest';

import { BanchoClient } from '#src/classes/ircClientClass.js';
import { IrcCommandWelcome } from '#src/classes/ircCommandWelcomeClass.js';

describe('IrcCommandWelcome', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });

  describe('constructor', () => {
    it('should create an instance of IrcCommandWelcome', () => {
      const command = new IrcCommandWelcome(banchoClient);

      expect(command).toBeInstanceOf(IrcCommandWelcome);
      expect(command).toHaveProperty('banchoClient', banchoClient);
    });
  });

  describe('handleCommand', () => {
    it('should emit bot_connected event', () => {
      const command = new IrcCommandWelcome(banchoClient);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledOnce();
      expect(eventEmitter).toHaveBeenCalledWith('bot_connected');
    });
  });
});
