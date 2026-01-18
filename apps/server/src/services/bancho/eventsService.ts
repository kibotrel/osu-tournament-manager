import {
  type BanchoClient,
  BanchoPublicChannel,
} from '@packages/bancho-client';
import type {
  BanchoLobbyState,
  BanchoTeamMode,
  BanchoWinCondition,
  WebSocketMatchMessage,
  WebSocketMessage,
} from '@packages/shared';
import {
  OsuBeatmapModification,
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  gameMatchIdFromBanchoChannel,
} from '@packages/shared';

import { baseMatchState } from '#src/constants/banchoConstants.js';
import { CacheStringTopic } from '#src/constants/cacheConstants.js';
import { logger } from '#src/dependencies/loggerDependency.js';
import { deleteStringInCacheByKey } from '#src/queries/cache/deleteCacheQueries.js';
import { setStringInCacheByKey } from '#src/queries/cache/updateCacheQueries.js';
import { webSocketServer } from '#src/websocketServer.js';

import {
  getMatchStateFromCache,
  removeMatchFromCachedSet,
} from '../cache/cacheService.js';

import { joinAllOngoingMatches } from './multiplayerService.js';

export const onBotConnected = async () => {
  logger.debug('[IRC] Connected to the osu! server.');

  await joinAllOngoingMatches();
};

export const onBotDisconnected = async (banchoClient: BanchoClient) => {
  logger.debug('[IRC] Disconnected from osu! server');

  await banchoClient.connect();
};

export const onBotJoinedChannel = ({ channel }: { channel: string }) => {
  logger.debug(`[IRC] Joined ${channel}.`);
};

export const onChannelMessage = ({
  channel,
  message,
  user,
}: {
  channel: string;
  message: string;
  user: string;
}) => {
  if (channel === BanchoPublicChannel.Lobby || !channel.startsWith('#')) {
    return;
  }

  logger.silly(`[IRC] New message in ${channel}`, {
    content: message,
    user,
  });

  const payload: WebSocketMessage<WebSocketMatchMessage> = {
    message: { author: user, content: message },
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${gameMatchIdFromBanchoChannel(channel)}:${WebSocketChannelMatchesEvent.ChatMessages}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
};

export const onConcurrentMatchLimitReached = () => {
  logger.warn('[IRC] Concurrent match limit reached.');
};

export const onMultiplayerChannelClosed = async ({
  channel,
}: {
  channel: string;
}) => {
  logger.debug(`[IRC] Match ${channel} closed.`);

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const promises = [
    removeMatchFromCachedSet(channel),
    deleteStringInCacheByKey(`${CacheStringTopic.MatchState}:${channelId}`),
  ];

  await Promise.all(promises);

  // TODO: investigate if we need to broadcast a message to clients here
};

export const onMultiplayerChannelHostChanged = ({
  channel,
  newHost,
}: {
  channel: string;
  newHost: string;
}) => {
  logger.debug(`[IRC] ${newHost} is now host of channel ${channel}`);
};

export const onMultiplayerChannelInformationIdentity = async ({
  channel,
  historyUrl,
  name,
}: {
  channel: string;
  historyUrl: string;
  name: string;
}) => {
  logger.debug(`[IRC] channel ${channel} information updated`, {
    historyUrl,
    name,
  });

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const matchState = (await getMatchStateFromCache(channelId)) ?? {
    ...baseMatchState,
  };
  const updatedMatchState: BanchoLobbyState = {
    ...matchState,
    historyUrl,
    name,
  };

  await setStringInCacheByKey({
    key: `${CacheStringTopic.MatchState}:${channelId}`,
    value: JSON.stringify(updatedMatchState),
  });
};

export const onMultiplayerChannelInformationCurrentlyPlaying = async ({
  beatmap,
  channel,
  url,
}: {
  beatmap: string;
  channel: string;
  url: string;
}) => {
  logger.debug(
    `[IRC] channel ${channel} is currently playing ${beatmap} (${url})`,
  );

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const matchState = (await getMatchStateFromCache(channelId)) ?? {
    ...baseMatchState,
  };
  const updatedMatchState: BanchoLobbyState = {
    ...matchState,
    activeBeatmap: { name: beatmap, url },
  };

  await setStringInCacheByKey({
    key: `${CacheStringTopic.MatchState}:${channelId}`,
    value: JSON.stringify(updatedMatchState),
  });
};

// TODO: teamMode and winCondition should be typed as BanchoTeamMode and BanchoWinCondition
export const onMultiplayerChannelInformationConditions = async ({
  channel,
  teamMode,
  winCondition,
}: {
  channel: string;
  teamMode: string;
  winCondition: string;
}) => {
  logger.debug(`[IRC] channel ${channel} conditions updated`, {
    teamMode,
    winCondition,
  });

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const matchState = (await getMatchStateFromCache(channelId)) ?? {
    ...baseMatchState,
  };
  const updatedMatchState: BanchoLobbyState = {
    ...matchState,
    teamMode: teamMode as BanchoTeamMode,
    winCondition: winCondition as BanchoWinCondition,
  };

  await setStringInCacheByKey({
    key: `${CacheStringTopic.MatchState}:${channelId}`,
    value: JSON.stringify(updatedMatchState),
  });
};

export const onMultiplayerChannelInformationGlobalModifications = async ({
  channel,
  modifications,
}: {
  channel: string;
  modifications: string[];
}) => {
  logger.debug(`[IRC] channel ${channel} global modifications updated`, {
    modifications,
  });

  const isNightcoreEnabled = modifications.includes(
    OsuBeatmapModification.Nightcore,
  );
  const sanitizedModifications = isNightcoreEnabled
    ? modifications.filter((modification) => {
        return modification !== OsuBeatmapModification.DoubleTime;
      })
    : modifications;
  const channelId = gameMatchIdFromBanchoChannel(channel);
  const matchState = (await getMatchStateFromCache(channelId)) ?? {
    ...baseMatchState,
  };
  const updatedMatchState: BanchoLobbyState = {
    ...matchState,
    globalModifications: sanitizedModifications as OsuBeatmapModification[],
  };

  await setStringInCacheByKey({
    key: `${CacheStringTopic.MatchState}:${channelId}`,
    value: JSON.stringify(updatedMatchState),
  });
};

export const onMultiplayerChannelInformationPlayerCount = ({
  channel,
  playerCount,
}: {
  channel: string;
  playerCount: number;
}) => {
  logger.debug(`[IRC] channel ${channel} player count updated`, {
    playerCount,
  });
};

export const onMultiplayerChannelInformationSlot = ({
  channel,
  gameUserId,
  isHost,
  isReady,
  modifications,
  slotNumber,
  user,
}: {
  channel: string;
  gameUserId: number;
  isHost: boolean;
  isReady: boolean;
  modifications: string[];
  slotNumber: number;
  user: string;
}) => {
  logger.debug(
    `[IRC] channel ${channel} slot ${slotNumber} information updated`,
    {
      gameUserId,
      isHost,
      isReady,
      modifications,
      user,
    },
  );
};

export const onMultiplayerChannelNameUpdated = async ({
  channel,
  name,
}: {
  channel: string;
  name: string;
}) => {
  logger.debug(`[IRC] channel ${channel} name updated`, {
    name,
  });

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const matchState = (await getMatchStateFromCache(channelId)) ?? {
    ...baseMatchState,
  };
  const updatedMatchState: BanchoLobbyState = {
    ...matchState,
    name,
  };

  await setStringInCacheByKey({
    key: `${CacheStringTopic.MatchState}:${channelId}`,
    value: JSON.stringify(updatedMatchState),
  });
};

export const onMultiplayerPlayerJoinedSlot = ({
  channel,
  slotNumber,
  user,
}: {
  channel: string;
  slotNumber: number;
  user: string;
}) => {
  logger.debug(`[IRC] ${user} joined channel ${channel} in slot ${slotNumber}`);
};

export const onMultiplayerPayerLeftRoom = ({
  channel,
  user,
}: {
  channel: string;
  user: string;
}) => {
  logger.debug(`[IRC] ${user} left channel ${channel}`);
};

export const onMultiplayerPlayerMovedSlot = ({
  channel,
  slotNumber,
  user,
}: {
  channel: string;
  slotNumber: number;
  user: string;
}) => {
  logger.debug(
    `[IRC] ${user} moved to slot ${slotNumber} in channel ${channel}`,
  );
};
