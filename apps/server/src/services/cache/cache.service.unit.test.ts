import type { BanchoLobbyState } from '@packages/shared';
import { describe, expect, it, vi } from 'vitest';

import {
  deleteListInCacheByKey,
  deleteStringInCacheByKey,
} from '#src/queries/cache/cache.delete.queries.js';
import {
  getListFromCacheByKey,
  getSetFromCacheByKey,
  getStringFromCacheByKey,
} from '#src/queries/cache/cache.get.queries.js';
import {
  addToListInCacheByKey,
  addToSetInCacheByKey,
  removeFromSetInCacheByKey,
  setStringInCacheByKey,
} from '#src/queries/cache/cache.update.queries.js';

import {
  addMatchMessageToCacheService,
  addMatchToCachedSetService,
  deleteMatchChatHistoryFromCacheService,
  deleteMatchStateFromCacheService,
  getAllOngoingMatchesFromCacheService,
  getMatchChatHistoryFromCacheService,
  getMatchStateFromCacheService,
  removeMatchFromCachedSetService,
  setMatchStateInCacheService,
} from './cache.service.js';

vi.mock('#src/queries/cache/cache.get.queries.js', () => {
  return {
    getListFromCacheByKey: vi.fn(),
    getSetFromCacheByKey: vi.fn(),
    getStringFromCacheByKey: vi.fn(),
  };
});

vi.mock('#src/queries/cache/cache.delete.queries.js', () => {
  return {
    deleteListInCacheByKey: vi.fn(),
    deleteSetInCacheByKey: vi.fn(),
    deleteStringInCacheByKey: vi.fn(),
  };
});

vi.mock('#src/queries/cache/cache.update.queries.js', () => {
  return {
    addToListInCacheByKey: vi.fn(),
    addToSetInCacheByKey: vi.fn(),
    setStringInCacheByKey: vi.fn(),
    removeFromListInCacheByKey: vi.fn(),
    removeFromSetInCacheByKey: vi.fn(),
  };
});

describe('addMatchMessageToCacheService', () => {
  it('should call addToListInCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const message = 'test-message';
    const mockedAddToListInCacheByKey = vi.mocked(addToListInCacheByKey);

    await addMatchMessageToCacheService({ channel, message });

    expect(mockedAddToListInCacheByKey).toHaveBeenCalledWith({
      expiryInSeconds: 3600,
      key: `match-messages:${channel}`,
      value: message,
    });
  });
});

describe('addMatchToCachedSetService', () => {
  it('should call addToSetInCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const mockedAddToSetInCacheByKey = vi.mocked(addToSetInCacheByKey);

    await addMatchToCachedSetService(channel);

    expect(mockedAddToSetInCacheByKey).toHaveBeenCalledWith({
      key: 'open-matches',
      value: channel,
    });
  });
});

describe('deleteMatchChatHistoryFromCacheService', () => {
  it('should call deleteListInCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const mockedDeleteListInCacheByKey = vi.mocked(deleteListInCacheByKey);

    await deleteMatchChatHistoryFromCacheService(channel);

    expect(mockedDeleteListInCacheByKey).toHaveBeenCalledWith(
      `match-messages:${channel}`,
    );
  });
});

describe('deleteMatchStateFromCacheService', () => {
  it('should call deleteStringInCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const mockedDeleteStringInCacheByKey = vi.mocked(deleteStringInCacheByKey);

    await deleteMatchStateFromCacheService(channel);

    expect(mockedDeleteStringInCacheByKey).toHaveBeenCalledWith(
      `match-state:${channel}`,
    );
  });
});

describe('getAllOngoingMatchesFromCacheService', () => {
  it('should call getSetFromCacheByKey with correct parameters', async () => {
    const mockedGetSetFromCacheByKey = vi.mocked(getSetFromCacheByKey);

    await getAllOngoingMatchesFromCacheService();

    expect(mockedGetSetFromCacheByKey).toHaveBeenCalledWith('open-matches');
  });
});

describe('getMatchChatHistoryFromCacheService', () => {
  it('should call getListFromCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const mockedGetListFromCacheByKey = vi.mocked(getListFromCacheByKey);

    await getMatchChatHistoryFromCacheService(channel);

    expect(mockedGetListFromCacheByKey).toHaveBeenCalledWith(
      `match-messages:${channel}`,
    );
  });
});

describe('getMatchStateFromCacheService', () => {
  it('should call getStringFromCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const mockedGetListFromCacheByKey = vi.mocked(getStringFromCacheByKey);

    await getMatchStateFromCacheService(channel);

    expect(mockedGetListFromCacheByKey).toHaveBeenCalledWith(
      `match-state:${channel}`,
    );
  });
});

describe('removeMatchFromCachedSetService', () => {
  it('should call removeFromSetInCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const mockedRemoveFromSetInCacheByKey = vi.mocked(
      removeFromSetInCacheByKey,
    );

    await removeMatchFromCachedSetService(channel);

    expect(mockedRemoveFromSetInCacheByKey).toHaveBeenCalledWith({
      key: 'open-matches',
      value: channel,
    });
  });
});

describe('setMatchStateInCacheService', () => {
  it('should call setStringInCacheByKey with correct parameters', async () => {
    const channel = 'test-channel';
    const state: BanchoLobbyState = {
      globalModifications: [],
      playerCount: 0,
      slots: [],
    };
    const mockedSetStringInCacheByKey = vi.mocked(setStringInCacheByKey);

    await setMatchStateInCacheService({ channel: 'test-channel', state });

    expect(mockedSetStringInCacheByKey).toHaveBeenCalledWith({
      key: `match-state:${channel}`,
      value: JSON.stringify(state),
    });
  });
});
