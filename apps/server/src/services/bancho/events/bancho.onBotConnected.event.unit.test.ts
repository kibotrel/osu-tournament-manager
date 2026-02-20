import { describe, expect, it, vi } from 'vitest';

import { joinAllOngoingMatchesService } from '#src/services/bancho/bancho.multiplayer.service.js';

import { onBotConnected } from './bancho.onBotConnected.event.js';

vi.mock('#src/dependencies/logger.dependency.js', () => {
  return { logger: { debug: vi.fn() } };
});

vi.mock('#src/services/bancho/bancho.multiplayer.service.js', () => {
  return {
    joinAllOngoingMatchesService: vi.fn(),
    openMultiplayerChannelService: vi.fn(),
  };
});

describe('onBotConnected', () => {
  it('should join all on-going matches', async () => {
    const joinAllOngoingMatchesServiceMock = vi.mocked(
      joinAllOngoingMatchesService,
    );

    await onBotConnected();

    expect(joinAllOngoingMatchesServiceMock).toHaveBeenCalled();
  });
});
