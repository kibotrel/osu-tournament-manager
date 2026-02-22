import { describe, expect, it, vi } from 'vitest';

import { joinAllOngoingMatchesService } from '#src/services/bancho/bancho.multiplayer.service.js';

import { onBotConnectedEvent } from './bancho.onBotConnected.event.js';

vi.mock('#src/dependencies/logger.dependency.js', () => {
  return { logger: { debug: vi.fn() } };
});

vi.mock('#src/services/bancho/bancho.multiplayer.service.js', () => {
  return {
    joinAllOngoingMatchesService: vi.fn(),
    openMultiplayerChannelService: vi.fn(),
  };
});

describe('onBotConnectedEvent', () => {
  it('should join all on-going matches', async () => {
    const joinAllOngoingMatchesServiceMock = vi.mocked(
      joinAllOngoingMatchesService,
    );

    await onBotConnectedEvent();

    expect(joinAllOngoingMatchesServiceMock).toHaveBeenCalled();
  });
});
