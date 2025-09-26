import { describe, expect, it, vi } from 'vitest';

import { CacheSetTopic } from '#src/constants/cacheConstants.js';
import { getSetFromCacheByKey } from '#src/queries/cache/getCacheQueries.js';
import {
  addToSetInCacheByKey,
  removeFromSetInCacheByKey,
} from '#src/queries/cache/updateCacheQueries.js';

import {
  addMatchToCachedSet,
  getAllOngoingMatchesFromCache,
  removeMatchFromCachedSet,
} from './cacheService.js';

vi.mock('#src/queries/cache/updateCacheQueries.js', () => {
  return {
    addToSetInCacheByKey: vi.fn(),
    removeFromSetInCacheByKey: vi.fn(),
  };
});

vi.mock('#src/queries/cache/getCacheQueries.js', () => {
  return {
    getSetFromCacheByKey: vi.fn(),
  };
});

describe('addMatchToCachedSet', () => {
  it('should call addToSetInCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const mockedAddToSetInCacheByKey = vi.mocked(addToSetInCacheByKey);

    await addMatchToCachedSet(channel);

    expect(mockedAddToSetInCacheByKey).toHaveBeenCalledWith({
      key: CacheSetTopic.OpenMatches,
      value: channel,
    });
  });
});

describe('getAllOngoingMatchesFromCache', () => {
  it('should call getSetFromCacheByKey with correct parameters', async () => {
    const mockedGetSetFromCacheByKey = vi.mocked(getSetFromCacheByKey);

    await getAllOngoingMatchesFromCache();

    expect(mockedGetSetFromCacheByKey).toHaveBeenCalledWith(
      CacheSetTopic.OpenMatches,
    );
  });
});

describe('removeMatchFromCachedSet', () => {
  it('should call removeFromSetInCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const mockedRemoveFromSetInCacheByKey = vi.mocked(
      removeFromSetInCacheByKey,
    );

    await removeMatchFromCachedSet(channel);

    expect(mockedRemoveFromSetInCacheByKey).toHaveBeenCalledWith({
      key: CacheSetTopic.OpenMatches,
      value: channel,
    });
  });
});
