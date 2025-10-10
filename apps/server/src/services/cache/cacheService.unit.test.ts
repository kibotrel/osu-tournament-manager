import { describe, expect, it, vi } from 'vitest';

import { deleteListInCacheByKey } from '#src/queries/cache/deleteCacheQueries.js';
import {
  getListFromCacheByKey,
  getSetFromCacheByKey,
} from '#src/queries/cache/getCacheQueries.js';
import {
  addToListInCacheByKey,
  addToSetInCacheByKey,
  removeFromSetInCacheByKey,
} from '#src/queries/cache/updateCacheQueries.js';

import {
  addMatchMessageToCache,
  addMatchToCachedSet,
  deleteMatchChatHistoryFromCache,
  getAllOngoingMatchesFromCache,
  getMatchChatHistoryFromCache,
  removeMatchFromCachedSet,
} from './cacheService.js';

vi.mock('#src/queries/cache/getCacheQueries.js', () => {
  return {
    getListFromCacheByKey: vi.fn(),
    getSetFromCacheByKey: vi.fn(),
  };
});

vi.mock('#src/queries/cache/deleteCacheQueries.js', () => {
  return {
    deleteListInCacheByKey: vi.fn(),
    deleteSetInCacheByKey: vi.fn(),
  };
});

vi.mock('#src/queries/cache/updateCacheQueries.js', () => {
  return {
    addToListInCacheByKey: vi.fn(),
    addToSetInCacheByKey: vi.fn(),
    removeFromListInCacheByKey: vi.fn(),
    removeFromSetInCacheByKey: vi.fn(),
  };
});

describe('addMatchMessageToCache', () => {
  it('should call addToListInCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const message = 'test-message';
    const mockedAddToListInCacheByKey = vi.mocked(addToListInCacheByKey);

    await addMatchMessageToCache({ channel, message });

    expect(mockedAddToListInCacheByKey).toHaveBeenCalledWith({
      expiryInSeconds: 3600,
      key: `match-messages:${channel}`,
      value: message,
    });
  });
});

describe('addMatchToCachedSet', () => {
  it('should call addToSetInCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const mockedAddToSetInCacheByKey = vi.mocked(addToSetInCacheByKey);

    await addMatchToCachedSet(channel);

    expect(mockedAddToSetInCacheByKey).toHaveBeenCalledWith({
      key: 'open-matches',
      value: channel,
    });
  });
});

describe('deleteMatchChatHistoryFromCache', () => {
  it('should call deleteListInCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const mockedDeleteListInCacheByKey = vi.mocked(deleteListInCacheByKey);

    await deleteMatchChatHistoryFromCache(channel);

    expect(mockedDeleteListInCacheByKey).toHaveBeenCalledWith(
      `match-messages:${channel}`,
    );
  });
});

describe('getAllOngoingMatchesFromCache', () => {
  it('should call getSetFromCacheByKey with correct parameters', async () => {
    const mockedGetSetFromCacheByKey = vi.mocked(getSetFromCacheByKey);

    await getAllOngoingMatchesFromCache();

    expect(mockedGetSetFromCacheByKey).toHaveBeenCalledWith('open-matches');
  });
});

describe('getMatchChatHistoryFromCache', () => {
  it('should call getListFromCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const mockedGetListFromCacheByKey = vi.mocked(getListFromCacheByKey);

    await getMatchChatHistoryFromCache(channel);

    expect(mockedGetListFromCacheByKey).toHaveBeenCalledWith(
      `match-messages:${channel}`,
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
      key: 'open-matches',
      value: channel,
    });
  });
});
