import { afterEach, describe, expect, it, vi } from 'vitest';

import { banchoClient } from '#src/dependencies/ircClient.dependency.js';
import {
  addMatchToCachedSet,
  getAllOngoingMatchesFromCache,
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
    addMatchToCachedSet: vi.fn(),
    getAllOngoingMatchesFromCache: vi.fn(),
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
    expect(addMatchToCachedSet).toHaveBeenCalledWith(banchoChannel);
    expect(gameMatchId).toBe(Number(banchoChannel.slice(4)));
  });
});

describe('joinAllOngoingMatchesService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should join all ongoing matches from cache', async () => {
    const ongoingMatches = ['#mp_123', '#mp_456'];
    const getAllOngoingMatchesFromCacheMock = vi.mocked(
      getAllOngoingMatchesFromCache,
    );
    const spyPromiseAll = vi.spyOn(Promise, 'all');

    getAllOngoingMatchesFromCacheMock.mockResolvedValueOnce(ongoingMatches);

    await joinAllOngoingMatchesService();

    expect(getAllOngoingMatchesFromCache).toHaveBeenCalled();
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
    const getAllOngoingMatchesFromCacheMock = vi.mocked(
      getAllOngoingMatchesFromCache,
    );
    const spyPromiseAll = vi.spyOn(Promise, 'all');

    getAllOngoingMatchesFromCacheMock.mockResolvedValueOnce([]);

    await joinAllOngoingMatchesService();

    expect(banchoClient.joinChannel).not.toHaveBeenCalled();
    expect(spyPromiseAll).not.toHaveBeenCalled();
  });
});
