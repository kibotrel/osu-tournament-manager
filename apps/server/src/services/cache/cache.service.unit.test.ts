import type { BanchoLobbyState } from '@packages/shared';
import { describe, expect, it, vi } from 'vitest';

import {
  deleteListInCacheByKeyQuery,
  deleteStringInCacheByKeyQuery,
} from '#src/queries/cache/cache.delete.queries.js';
import {
  getListFromCacheByKeyQuery,
  getSetFromCacheByKeyQuery,
  getStringFromCacheByKeyQuery,
} from '#src/queries/cache/cache.get.queries.js';
import {
  addToListInCacheByKeyQuery,
  addToSetInCacheByKeyQuery,
  removeFromSetInCacheByKeyQuery,
  setStringInCacheByKeyQuery,
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
    getListFromCacheByKeyQuery: vi.fn(),
    getSetFromCacheByKeyQuery: vi.fn(),
    getStringFromCacheByKeyQuery: vi.fn(),
  };
});

vi.mock('#src/queries/cache/cache.delete.queries.js', () => {
  return {
    deleteListInCacheByKeyQuery: vi.fn(),
    deleteSetInCacheByKey: vi.fn(),
    deleteStringInCacheByKeyQuery: vi.fn(),
  };
});

vi.mock('#src/queries/cache/cache.update.queries.js', () => {
  return {
    addToListInCacheByKeyQuery: vi.fn(),
    addToSetInCacheByKeyQuery: vi.fn(),
    setStringInCacheByKeyQuery: vi.fn(),
    removeFromListInCacheByKeyQuery: vi.fn(),
    removeFromSetInCacheByKeyQuery: vi.fn(),
  };
});

describe('addMatchMessageToCacheService', () => {
  it('should call addToListInCacheByKeyQuery with correct parameters', async () => {
    const channel = 'test-channel';
    const message = 'test-message';
    const addToListInCacheByKeyQueryMock = vi.mocked(
      addToListInCacheByKeyQuery,
    );

    await addMatchMessageToCacheService({ channel, message });

    expect(addToListInCacheByKeyQueryMock).toHaveBeenCalledWith({
      expiryInSeconds: 3600,
      key: `match-messages:${channel}`,
      value: message,
    });
  });
});

describe('addMatchToCachedSetService', () => {
  it('should call addToSetInCacheByKeyQuery with correct parameters', async () => {
    const channel = 'test-channel';
    const addToSetInCacheByKeyQueryMock = vi.mocked(addToSetInCacheByKeyQuery);

    await addMatchToCachedSetService(channel);

    expect(addToSetInCacheByKeyQueryMock).toHaveBeenCalledWith({
      key: 'open-matches',
      value: channel,
    });
  });
});

describe('deleteMatchChatHistoryFromCacheService', () => {
  it('should call deleteListInCacheByKeyQuery with correct parameters', async () => {
    const channel = 'test-channel';
    const deleteListInCacheByKeyQueryMock = vi.mocked(
      deleteListInCacheByKeyQuery,
    );

    await deleteMatchChatHistoryFromCacheService(channel);

    expect(deleteListInCacheByKeyQueryMock).toHaveBeenCalledWith(
      `match-messages:${channel}`,
    );
  });
});

describe('deleteMatchStateFromCacheService', () => {
  it('should call deleteStringInCacheByKeyQuery with correct parameters', async () => {
    const channel = 'test-channel';
    const deleteStringInCacheByKeyQueryMock = vi.mocked(
      deleteStringInCacheByKeyQuery,
    );

    await deleteMatchStateFromCacheService(channel);

    expect(deleteStringInCacheByKeyQueryMock).toHaveBeenCalledWith(
      `match-state:${channel}`,
    );
  });
});

describe('getAllOngoingMatchesFromCacheService', () => {
  it('should call getSetFromCacheByKeyQuery with correct parameters', async () => {
    const getSetFromCacheByKeyQueryMock = vi.mocked(getSetFromCacheByKeyQuery);

    await getAllOngoingMatchesFromCacheService();

    expect(getSetFromCacheByKeyQueryMock).toHaveBeenCalledWith('open-matches');
  });
});

describe('getMatchChatHistoryFromCacheService', () => {
  it('should call getListFromCacheByKeyQuery with correct parameters', async () => {
    const channel = 'test-channel';
    const getListFromCacheByKeyQueryMock = vi.mocked(
      getListFromCacheByKeyQuery,
    );

    await getMatchChatHistoryFromCacheService(channel);

    expect(getListFromCacheByKeyQueryMock).toHaveBeenCalledWith(
      `match-messages:${channel}`,
    );
  });
});

describe('getMatchStateFromCacheService', () => {
  it('should call getStringFromCacheByKeyQuery with correct parameters', async () => {
    const channel = 'test-channel';
    const getStringFromCacheByKeyQueryMock = vi.mocked(
      getStringFromCacheByKeyQuery,
    );

    await getMatchStateFromCacheService(channel);

    expect(getStringFromCacheByKeyQueryMock).toHaveBeenCalledWith(
      `match-state:${channel}`,
    );
  });
});

describe('removeMatchFromCachedSetService', () => {
  it('should call removeFromSetInCacheByKeyQuery with correct parameters', async () => {
    const channel = 'test-channel';
    const removeFromSetInCacheByKeyQueryMock = vi.mocked(
      removeFromSetInCacheByKeyQuery,
    );

    await removeMatchFromCachedSetService(channel);

    expect(removeFromSetInCacheByKeyQueryMock).toHaveBeenCalledWith({
      key: 'open-matches',
      value: channel,
    });
  });
});

describe('setMatchStateInCacheService', () => {
  it('should call setStringInCacheByKeyQuery with correct parameters', async () => {
    const channel = 'test-channel';
    const state: BanchoLobbyState = {
      globalModifications: [],
      playerCount: 0,
      slots: [],
    };
    const setStringInCacheByKeyQueryMock = vi.mocked(
      setStringInCacheByKeyQuery,
    );

    await setMatchStateInCacheService({ channel: 'test-channel', state });

    expect(setStringInCacheByKeyQueryMock).toHaveBeenCalledWith({
      key: `match-state:${channel}`,
      value: JSON.stringify(state),
    });
  });
});
