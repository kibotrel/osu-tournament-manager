import { BanchoClient } from '@packages/bancho-client';
import { describe, expect, it, vi } from 'vitest';

import { onBotDisconnected } from './onBotDisconnectedEvent.js';

vi.mock('#src/dependencies/loggerDependency.js', () => {
  return { logger: { debug: vi.fn() } };
});

const mockBanchoClient = new BanchoClient({
  clientCredentials: { username: 'bot', password: 'password' },
  serverInformation: { host: 'irc.ppy.sh', port: 6667 },
});

mockBanchoClient.connect = vi.fn();

describe('onBotDisconnected', () => {
  it('should reconnect to the server', async () => {
    await onBotDisconnected(mockBanchoClient);

    expect(mockBanchoClient.connect).toHaveBeenCalled();
  });
});
