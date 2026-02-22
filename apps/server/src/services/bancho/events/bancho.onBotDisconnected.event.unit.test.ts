import { describe, expect, it, vi } from 'vitest';

import { banchoClient } from '#src/dependencies/ircClient.dependency.js';

import { onBotDisconnectedEvent } from './bancho.onBotDisconnected.event.js';

vi.mock('#src/dependencies/logger.dependency.js', () => {
  return { logger: { debug: vi.fn() } };
});

vi.mock('#src/dependencies/ircClient.dependency.js', () => {
  return { banchoClient: { connect: vi.fn() } };
});

describe('onBotDisconnectedEvent', () => {
  it('should reconnect to the server', async () => {
    const mockedBanchoClient = vi.mocked(banchoClient);

    await onBotDisconnectedEvent();

    expect(mockedBanchoClient.connect).toHaveBeenCalled();
  });
});
