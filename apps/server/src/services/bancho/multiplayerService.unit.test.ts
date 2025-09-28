import { afterEach, describe, expect, it, vi } from 'vitest';

import { banchoClient } from '#src/dependencies/ircClientDependency.js';
import {
  addMatchToCachedSet,
  getAllOngoingMatchesFromCache,
} from '#src/services/cache/cacheService.js';

import {
  joinAllOngoingMatches,
  openMultiplayerChannel,
} from './multiplayerService.js';

vi.mock('#src/dependencies/ircClientDependency.js', () => {
  return {
    banchoClient: {
      createMultiplayerChannel: vi.fn(),
      joinChannel: vi.fn(),
    },
  };
});

vi.mock('#src/services/cache/cacheService.js', () => {
  return {
    addMatchToCachedSet: vi.fn(),
    getAllOngoingMatchesFromCache: vi.fn(),
  };
});

describe('openMultiplayerChannel', () => {
  it('should open a multiplayer channel on bancho and add it to the cache', async () => {
    const name = 'testMatch';
    const createMultiplayerChannelMock = vi.mocked(
      banchoClient.createMultiplayerChannel,
    );
    const banchoChannel = '#mp_123456';

    createMultiplayerChannelMock.mockResolvedValueOnce(banchoChannel);

    const { gameMatchId } = await openMultiplayerChannel(name);

    expect(banchoClient.createMultiplayerChannel).toHaveBeenCalledWith(name);
    expect(addMatchToCachedSet).toHaveBeenCalledWith(banchoChannel);
    expect(gameMatchId).toBe(Number(banchoChannel.slice(4)));
  });
});

describe('joinAllOngoingMatches', () => {
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

    await joinAllOngoingMatches();

    expect(getAllOngoingMatchesFromCache).toHaveBeenCalled();
    expect(banchoClient.joinChannel).toHaveBeenCalledTimes(
      ongoingMatches.length,
    );

    for (const channel of ongoingMatches) {
      expect(banchoClient.joinChannel).toHaveBeenCalledWith(channel);
    }

    expect(spyPromiseAll).toHaveBeenCalled();
  });

  it('should not attempt to join any channels if there are no ongoing matches', async () => {
    const getAllOngoingMatchesFromCacheMock = vi.mocked(
      getAllOngoingMatchesFromCache,
    );
    const spyPromiseAll = vi.spyOn(Promise, 'all');

    getAllOngoingMatchesFromCacheMock.mockResolvedValueOnce([]);

    await joinAllOngoingMatches();

    expect(banchoClient.joinChannel).not.toHaveBeenCalled();
    expect(spyPromiseAll).not.toHaveBeenCalled();
  });
});
