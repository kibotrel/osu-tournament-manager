import { describe, expect, it, vi } from 'vitest';

import { joinAllOngoingMatches } from '#src/services/bancho/multiplayerService.js';

import { onBotConnected } from './onBotConnectedEvent.js';

vi.mock('#src/dependencies/loggerDependency.js', () => {
  return { logger: { debug: vi.fn() } };
});

vi.mock('#src/services/bancho/multiplayerService.js', () => {
  return { joinAllOngoingMatches: vi.fn(), openMultiplayerChannel: vi.fn() };
});

describe('onBotConnected', () => {
  it('should join all on-going matches', async () => {
    const joinAllOngoingMatchesMock = vi.mocked(joinAllOngoingMatches);

    await onBotConnected();

    expect(joinAllOngoingMatchesMock).toHaveBeenCalled();
  });
});
