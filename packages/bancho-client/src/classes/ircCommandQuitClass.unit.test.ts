import { describe, expect, it, vi } from 'vitest';

import { BanchoClient } from '#src/classes/ircClientClass.js';
import { IrcCommandQuit } from '#src/classes/ircCommandQuitClass.js';

describe('IrcCommandQuit', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });
  const packetParts = ['username!server@localhost.dev QUIT', 'quit'];

  describe('constructor', () => {
    it('should create an instance of IrcCommandPart', () => {
      const command = new IrcCommandQuit(banchoClient, packetParts);

      expect(command).toBeInstanceOf(IrcCommandQuit);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });
  });

  describe('handleCommand', () => {
    it('should emit user_disconnected event with the corresponding user', () => {
      const command = new IrcCommandQuit(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledOnce();
      expect(eventEmitter).toHaveBeenCalledWith('user_disconnected', {
        user: 'username',
      });
    });
  });
});
