import { describe, expect, it, vi } from 'vitest';

import { joinAllOngoingMatches } from '#src/services/bancho/bancho.multiplayer.service.js';

import { onBotConnected } from './bancho.onBotConnected.event.js';

vi.mock('#src/dependencies/logger.dependency.js', () => {
  return { logger: { debug: vi.fn() } };
});

vi.mock('#src/services/bancho/bancho.multiplayer.service.js', () => {
  return { joinAllOngoingMatches: vi.fn(), openMultiplayerChannel: vi.fn() };
});

describe('onBotConnected', () => {
  it('should join all on-going matches', async () => {
    const joinAllOngoingMatchesMock = vi.mocked(joinAllOngoingMatches);

    await onBotConnected();

    expect(joinAllOngoingMatchesMock).toHaveBeenCalled();
  });
});
