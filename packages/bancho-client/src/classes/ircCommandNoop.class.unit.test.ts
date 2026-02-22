import { describe, expect, it, vi } from 'vitest';

import { BanchoClient } from '#src/classes/ircClient.class.js';
import { IrcCommandNoop } from '#src/classes/ircCommandNoop.class.js';
import type { IrcKeyword } from '#src/constants/irc.constants.js';

describe('IrcCommandNoop', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });
  const packetParts = ['localhost.dev UNKNOWN_COMMAND', 'test1', 'test2'];

  describe('constructor', () => {
    it('should create an instance of IrcCommandNoop', () => {
      const command = new IrcCommandNoop(
        banchoClient,
        'UNKNOWN_COMMAND' as IrcKeyword,
        packetParts,
      );

      expect(command).toBeInstanceOf(IrcCommandNoop);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('command', 'UNKNOWN_COMMAND');
      expect(command).toHaveProperty('packetParts', packetParts);
    });
  });

  describe('handleCommand', () => {
    it('should console.log used command and packetParts for later implementation', () => {
      const command = new IrcCommandNoop(
        banchoClient,
        'UNKNOWN_COMMAND' as IrcKeyword,
        packetParts,
      );
      const logger = vi.spyOn(console, 'log');

      command.handleCommand();

      expect(logger).toHaveBeenCalledOnce();
      expect(logger).toHaveBeenCalledWith({
        command: 'UNKNOWN_COMMAND',
        packetParts: ['localhost.dev UNKNOWN_COMMAND', 'test1', 'test2'],
      });
    });
  });
});
