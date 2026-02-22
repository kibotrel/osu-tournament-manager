import { describe, expect, it, vi } from 'vitest';

import { BanchoClient } from '#src/classes/ircClient.class.js';
import { IrcCommandRecipientNotFound } from '#src/classes/ircCommandRecipientNotFound.class.js';

describe('IrcCommandRecipientNotFound', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });
  const packetParts = ['localhost.dev 401 username1 username2', 'No such nick'];

  describe('constructor', () => {
    it('should create an instance of IrcCommandRecipientNotFound', () => {
      const command = new IrcCommandRecipientNotFound(
        banchoClient,
        packetParts,
      );

      expect(command).toBeInstanceOf(IrcCommandRecipientNotFound);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
    });
  });

  describe('handleCommand', () => {
    it('should emit recipient_not_found event with the corresponding recipient', () => {
      const command = new IrcCommandRecipientNotFound(
        banchoClient,
        packetParts,
      );
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(2);
      expect(eventEmitter).toHaveBeenCalledWith('recipient_not_found', {
        recipient: 'username2',
      });
      expect(eventEmitter).toHaveBeenCalledWith(
        'recipient_not_found:username2',
      );
    });
  });
});
