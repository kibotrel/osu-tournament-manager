import { describe, expect, it, vi } from 'vitest';

import { banchoClient } from '#src/dependencies/ircClientDependency.js';

import { onBotDisconnected } from './onBotDisconnectedEvent.js';

vi.mock('#src/dependencies/loggerDependency.js', () => {
  return { logger: { debug: vi.fn() } };
});

vi.mock('#src/dependencies/ircClientDependency.js', () => {
  return { banchoClient: { connect: vi.fn() } };
});

describe('onBotDisconnected', () => {
  it('should reconnect to the server', async () => {
    const mockedBanchoClient = vi.mocked(banchoClient);

    await onBotDisconnected();

    expect(mockedBanchoClient.connect).toHaveBeenCalled();
  });
});
