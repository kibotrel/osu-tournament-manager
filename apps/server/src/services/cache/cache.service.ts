import type { BanchoLobbyState } from '@packages/shared';

import {
  CacheExpiry,
  CacheListTopic,
  CacheSetTopic,
  CacheStringTopic,
} from '#src/constants/cache.constants.js';
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

export const addMatchMessageToCacheService = async (options: {
  channel: number | string;
  message: string;
}) => {
  const { channel, message } = options;

  await addToListInCacheByKeyQuery({
    expiryInSeconds: CacheExpiry.MatchMessages,
    key: `${CacheListTopic.MatchMessages}:${channel}`,
    value: message,
  });
};

export const addMatchToCachedSetService = async (channel: string) => {
  await addToSetInCacheByKeyQuery({
    key: CacheSetTopic.OpenMatches,
    value: channel,
  });
};

export const deleteMatchChatHistoryFromCacheService = async (
  channel: number | string,
) => {
  await deleteListInCacheByKeyQuery(
    `${CacheListTopic.MatchMessages}:${channel}`,
  );
};

export const deleteMatchStateFromCacheService = async (
  channel: number | string,
) => {
  await deleteStringInCacheByKeyQuery(
    `${CacheStringTopic.MatchState}:${channel}`,
  );
};

export const getAllOngoingMatchesFromCacheService = async () => {
  return await getSetFromCacheByKeyQuery(CacheSetTopic.OpenMatches);
};

export const getMatchChatHistoryFromCacheService = async (
  channel: number | string,
) => {
  return await getListFromCacheByKeyQuery(
    `${CacheListTopic.MatchMessages}:${channel}`,
  );
};

export const getMatchStateFromCacheService = async (
  channel: number | string,
) => {
  const matchState = await getStringFromCacheByKeyQuery(
    `${CacheStringTopic.MatchState}:${channel}`,
  );

  if (!matchState) {
    return null;
  }

  return JSON.parse(matchState) as BanchoLobbyState;
};

export const removeMatchFromCachedSetService = async (channel: string) => {
  await removeFromSetInCacheByKeyQuery({
    key: CacheSetTopic.OpenMatches,
    value: channel,
  });
};

export const setMatchStateInCacheService = async (options: {
  channel: number | string;
  state: BanchoLobbyState;
}) => {
  const { channel, state } = options;

  await setStringInCacheByKeyQuery({
    key: `${CacheStringTopic.MatchState}:${channel}`,
    value: JSON.stringify(state),
  });
};
