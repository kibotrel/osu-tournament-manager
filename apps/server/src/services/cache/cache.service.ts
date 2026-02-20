import type { BanchoLobbyState } from '@packages/shared/dist/src/types/banchoTypes.js';

import {
  CacheExpiry,
  CacheListTopic,
  CacheSetTopic,
  CacheStringTopic,
} from '#src/constants/cache.constants.js';
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

export const addMatchMessageToCacheService = async (options: {
  channel: number | string;
  message: string;
}) => {
  const { channel, message } = options;

  await addToListInCacheByKey({
    expiryInSeconds: CacheExpiry.MatchMessages,
    key: `${CacheListTopic.MatchMessages}:${channel}`,
    value: message,
  });
};

export const addMatchToCachedSetService = async (channel: string) => {
  await addToSetInCacheByKey({
    key: CacheSetTopic.OpenMatches,
    value: channel,
  });
};

export const deleteMatchChatHistoryFromCacheService = async (
  channel: number | string,
) => {
  await deleteListInCacheByKey(`${CacheListTopic.MatchMessages}:${channel}`);
};

export const deleteMatchStateFromCacheService = async (
  channel: number | string,
) => {
  await deleteStringInCacheByKey(`${CacheStringTopic.MatchState}:${channel}`);
};

export const getAllOngoingMatchesFromCacheService = async () => {
  return await getSetFromCacheByKey(CacheSetTopic.OpenMatches);
};

export const getMatchChatHistoryFromCacheService = async (
  channel: number | string,
) => {
  return await getListFromCacheByKey(
    `${CacheListTopic.MatchMessages}:${channel}`,
  );
};

export const getMatchStateFromCacheService = async (
  channel: number | string,
) => {
  const matchState = await getStringFromCacheByKey(
    `${CacheStringTopic.MatchState}:${channel}`,
  );

  if (!matchState) {
    return null;
  }

  return JSON.parse(matchState) as BanchoLobbyState;
};

export const removeMatchFromCachedSetService = async (channel: string) => {
  await removeFromSetInCacheByKey({
    key: CacheSetTopic.OpenMatches,
    value: channel,
  });
};

export const setMatchStateInCacheService = async (options: {
  channel: number | string;
  state: BanchoLobbyState;
}) => {
  const { channel, state } = options;

  await setStringInCacheByKey({
    key: `${CacheStringTopic.MatchState}:${channel}`,
    value: JSON.stringify(state),
  });
};
