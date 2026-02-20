import { afterEach, describe, expect, it, vi } from 'vitest';

import { banchoClient } from '#src/dependencies/ircClient.dependency.js';
import {
  addMatchToCachedSetService,
  getAllOngoingMatchesFromCacheService,
} from '#src/services/cache/cache.service.js';

import {
  joinAllOngoingMatchesService,
  openMultiplayerChannelService,
} from './bancho.multiplayer.service.js';

vi.mock('#src/dependencies/ircClient.dependency.js', () => {
  return {
    banchoClient: {
      createMultiplayerChannel: vi.fn(),
      joinChannel: vi.fn(),
    },
  };
});

vi.mock('#src/services/cache/cache.service.js', () => {
  return {
    addMatchToCachedSetService: vi.fn(),
    getAllOngoingMatchesFromCacheService: vi.fn(),
  };
});

describe('openMultiplayerChannelService', () => {
  it('should open a multiplayer channel on bancho and add it to the cache', async () => {
    const name = 'testMatch';
    const createMultiplayerChannelMock = vi.mocked(
      banchoClient.createMultiplayerChannel,
    );
    const banchoChannel = '#mp_123456';

    createMultiplayerChannelMock.mockResolvedValueOnce(banchoChannel);

    const { gameMatchId } = await openMultiplayerChannelService(name);

    expect(banchoClient.createMultiplayerChannel).toHaveBeenCalledWith(name);
    expect(addMatchToCachedSetService).toHaveBeenCalledWith(banchoChannel);
    expect(gameMatchId).toBe(Number(banchoChannel.slice(4)));
  });
});

describe('joinAllOngoingMatchesService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should join all ongoing matches from cache', async () => {
    const ongoingMatches = ['#mp_123', '#mp_456'];
    const getAllOngoingMatchesFromCacheServiceMock = vi.mocked(
      getAllOngoingMatchesFromCacheService,
    );
    const spyPromiseAll = vi.spyOn(Promise, 'all');

    getAllOngoingMatchesFromCacheServiceMock.mockResolvedValueOnce(
      ongoingMatches,
    );

    await joinAllOngoingMatchesService();

    expect(getAllOngoingMatchesFromCacheService).toHaveBeenCalled();
    expect(banchoClient.joinChannel).toHaveBeenCalledTimes(
      ongoingMatches.length,
    );

    for (const channel of ongoingMatches) {
      expect(banchoClient.joinChannel).toHaveBeenCalledWith(channel);
    }

    expect(spyPromiseAll).toHaveBeenCalled();
    expect(spyPromiseAll.mock.calls[0][0]).toHaveLength(2);
  });

  it('should not attempt to join any channels if there are no ongoing matches', async () => {
    const getAllOngoingMatchesFromCacheServiceMock = vi.mocked(
      getAllOngoingMatchesFromCacheService,
    );
    const spyPromiseAll = vi.spyOn(Promise, 'all');

    getAllOngoingMatchesFromCacheServiceMock.mockResolvedValueOnce([]);

    await joinAllOngoingMatchesService();

    expect(banchoClient.joinChannel).not.toHaveBeenCalled();
    expect(spyPromiseAll).not.toHaveBeenCalled();
  });
});
