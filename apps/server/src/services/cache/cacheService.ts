import {
  CacheExpiry,
  CacheListTopic,
  CacheSetTopic,
} from '#src/constants/cacheConstants.js';
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

export const addMatchMessageToCache = async (options: {
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

export const addMatchToCachedSet = async (channel: string) => {
  await addToSetInCacheByKey({
    key: CacheSetTopic.OpenMatches,
    value: channel,
  });
};

export const deleteMatchChatHistoryFromCache = async (
  channel: number | string,
) => {
  await deleteListInCacheByKey(`${CacheListTopic.MatchMessages}:${channel}`);
};

export const getAllOngoingMatchesFromCache = async () => {
  return await getSetFromCacheByKey(CacheSetTopic.OpenMatches);
};

export const getMatchChatHistoryFromCache = async (
  channel: number | string,
) => {
  return await getListFromCacheByKey(
    `${CacheListTopic.MatchMessages}:${channel}`,
  );
};

export const removeMatchFromCachedSet = async (channel: string) => {
  await removeFromSetInCacheByKey({
    key: CacheSetTopic.OpenMatches,
    value: channel,
  });
};
