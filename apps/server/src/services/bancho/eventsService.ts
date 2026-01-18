import {
  type BanchoClient,
  BanchoPublicChannel,
} from '@packages/bancho-client';
import type {
  BanchoLobbyState,
  BanchoTeamMode,
  BanchoWinCondition,
  WebSocketMatchLobbyState,
  WebSocketMatchMessage,
  WebSocketMessage,
} from '@packages/shared';
import {
  OsuBeatmapModification,
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  gameMatchIdFromBanchoChannel,
} from '@packages/shared';

import { baseSlot } from '#src/constants/banchoConstants.js';
import { logger } from '#src/dependencies/loggerDependency.js';
import { webSocketServer } from '#src/websocketServer.js';

import {
  addMatchMessageToCache,
  deleteMatchChatHistoryFromCache,
  deleteMatchStateFromCache,
  removeMatchFromCachedSet,
  setMatchStateInCache,
} from '../cache/cacheService.js';
import { getMatchStateService } from '../matches/matchesService.js';

import { joinAllOngoingMatches } from './multiplayerService.js';

export const onBotConnected = async () => {
  logger.debug('[IRC] Connected to the osu! server');

  await joinAllOngoingMatches();
};

export const onBotDisconnected = async (banchoClient: BanchoClient) => {
  logger.debug('[IRC] Disconnected from osu! server');

  await banchoClient.connect();
};

export const onBotJoinedChannel = ({ channel }: { channel: string }) => {
  logger.debug(`[IRC] Joined ${channel}`);
};

export const onChannelMessage = async ({
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

  logger.debug(`[IRC] New message in ${channel}`, {
    content: message,
    user,
  });

  const gameMatchId = gameMatchIdFromBanchoChannel(channel);
  const payload: WebSocketMessage<WebSocketMatchMessage> = {
    message: { author: user, content: message },
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${gameMatchId}:${WebSocketChannelMatchesEvent.ChatMessages}`,
  };
  const buffer = Buffer.from(JSON.stringify(payload));

  await addMatchMessageToCache({
    channel: gameMatchId,
    message: buffer.toString(),
  });
  webSocketServer.broadcastMessageToSubscribers(buffer, {
    isBinary: false,
    isBanchoMessage: true,
  });
};

export const onConcurrentMatchLimitReached = () => {
  logger.warn('[IRC] Concurrent match limit reached');
};

export const onMultiplayerChannelAllPlayersReady = async ({
  channel,
}: {
  channel: string;
}) => {
  logger.debug(`[IRC] All players ready in match ${channel}`);

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = {
    ...oldMatchState,
    slots: oldMatchState.slots.map((slot) => {
      return slot.player === null ? slot : { ...slot, isReady: true };
    }),
  };

  await setMatchStateInCache({
    channel: channelId,
    state: newMatchState,
  });

  const payload: WebSocketMessage<WebSocketMatchLobbyState> = {
    message: newMatchState,
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
};

export const onMultiplayerChannelClosed = async ({
  channel,
}: {
  channel: string;
}) => {
  logger.debug(`[IRC] Match ${channel} closed`);

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const promises = [
    deleteMatchChatHistoryFromCache(channelId),
    deleteMatchStateFromCache(channelId),
    removeMatchFromCachedSet(channel),
  ];

  await Promise.all(promises);

  // TODO: investigate if we need to broadcast a message to clients here
};

export const onMultiplayerChannelHostChanged = async ({
  channel,
  newHost,
}: {
  channel: string;
  newHost: string;
}) => {
  logger.debug(`[IRC] ${newHost} is now host of channel ${channel}`);

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = {
    ...oldMatchState,
    slots: oldMatchState.slots.map((slot) => {
      if (slot.player === newHost) {
        return { ...slot, isHost: true };
      }

      if (slot.isHost) {
        return { ...slot, isHost: false };
      }

      return slot;
    }),
  };

  await setMatchStateInCache({
    channel: channelId,
    state: newMatchState,
  });

  const payload: WebSocketMessage<WebSocketMatchLobbyState> = {
    message: newMatchState,
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
};

export const onMultiplayerChannelHostCleared = async ({
  channel,
}: {
  channel: string;
}) => {
  logger.debug(`[IRC] Host cleared in channel ${channel}`);

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = {
    ...oldMatchState,
    slots: oldMatchState.slots.map((slot) => {
      if (slot.isHost) {
        return { ...slot, isHost: false };
      }

      return slot;
    }),
  };

  await setMatchStateInCache({
    channel: channelId,
    state: newMatchState,
  });

  const payload: WebSocketMessage<WebSocketMatchLobbyState> = {
    message: newMatchState,
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
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
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = {
    ...oldMatchState,
    historyUrl,
    name,
  };

  await setMatchStateInCache({
    channel: channelId,
    state: newMatchState,
  });

  const payload: WebSocketMessage<WebSocketMatchLobbyState> = {
    message: newMatchState,
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
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
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = {
    ...oldMatchState,
    activeBeatmap: { name: beatmap, url },
  };

  await setMatchStateInCache({
    channel: channelId,
    state: newMatchState,
  });

  const payload: WebSocketMessage<WebSocketMatchLobbyState> = {
    message: newMatchState,
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
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
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = {
    ...oldMatchState,
    teamMode: teamMode as BanchoTeamMode,
    winCondition: winCondition as BanchoWinCondition,
  };

  await setMatchStateInCache({
    channel: channelId,
    state: newMatchState,
  });

  const payload: WebSocketMessage<WebSocketMatchLobbyState> = {
    message: newMatchState,
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
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
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = {
    ...oldMatchState,
    globalModifications: sanitizedModifications as OsuBeatmapModification[],
  };

  await setMatchStateInCache({
    channel: channelId,
    state: newMatchState,
  });

  const payload: WebSocketMessage<WebSocketMatchLobbyState> = {
    message: newMatchState,
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
};

export const onMultiplayerChannelInformationPlayerCount = async ({
  channel,
  playerCount,
}: {
  channel: string;
  playerCount: number;
}) => {
  logger.debug(`[IRC] channel ${channel} player count updated`, {
    playerCount,
  });

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = { ...oldMatchState, playerCount };

  await setMatchStateInCache({
    channel: channelId,
    state: newMatchState,
  });

  const payload: WebSocketMessage<WebSocketMatchLobbyState> = {
    message: newMatchState,
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
};

export const onMultiplayerChannelInformationSlot = async ({
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

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = {
    ...oldMatchState,
    slots: oldMatchState.slots.toSpliced(slotNumber - 1, 1, {
      isHost,
      isReady,
      player: user,
      selectedModifications: modifications as OsuBeatmapModification[],
    }),
  };

  await setMatchStateInCache({
    channel: channelId,
    state: newMatchState,
  });

  const payload: WebSocketMessage<WebSocketMatchLobbyState> = {
    message: newMatchState,
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
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
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = { ...oldMatchState, name };

  await setMatchStateInCache({
    channel: channelId,
    state: newMatchState,
  });

  const payload: WebSocketMessage<WebSocketMatchLobbyState> = {
    message: newMatchState,
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
};

export const onMultiplayerPlayerJoinedSlot = async ({
  channel,
  slotNumber,
  user,
}: {
  channel: string;
  slotNumber: number;
  user: string;
}) => {
  logger.debug(`[IRC] ${user} joined channel ${channel} in slot ${slotNumber}`);

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = {
    ...oldMatchState,
    playerCount: oldMatchState.playerCount + 1,
    slots: oldMatchState.slots.toSpliced(slotNumber - 1, 1, {
      ...baseSlot,
      player: user,
    }),
  };

  await setMatchStateInCache({
    channel: channelId,
    state: newMatchState,
  });

  const payload: WebSocketMessage<WebSocketMatchLobbyState> = {
    message: newMatchState,
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
};

export const onMultiplayerPayerLeftRoom = async ({
  channel,
  user,
}: {
  channel: string;
  user: string;
}) => {
  logger.debug(`[IRC] ${user} left channel ${channel}`);

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = {
    ...oldMatchState,
    playerCount: oldMatchState.playerCount - 1,
    slots: oldMatchState.slots.map((slot) => {
      return slot.player === user ? { ...baseSlot } : slot;
    }),
  };

  await setMatchStateInCache({
    channel: channelId,
    state: newMatchState,
  });

  const payload: WebSocketMessage<WebSocketMatchLobbyState> = {
    message: newMatchState,
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
};

export const onMultiplayerPlayerMovedSlot = async ({
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

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const oldMatchState = await getMatchStateService(channelId);
  const movedSlot = oldMatchState.slots.find((slot) => {
    return slot.player === user;
  });

  if (!movedSlot) {
    logger.warn(
      `[IRC] Could not find slot for ${user} in channel ${channel} when moving to slot ${slotNumber}`,
    );

    return;
  }

  const newMatchState: BanchoLobbyState = {
    ...oldMatchState,
    slots: oldMatchState.slots.map((slot, index) => {
      if (slot.player === user) {
        return { ...baseSlot };
      }

      if (index === slotNumber - 1) {
        return movedSlot;
      }

      return slot;
    }),
  };

  await setMatchStateInCache({
    channel: channelId,
    state: newMatchState,
  });

  const payload: WebSocketMessage<WebSocketMatchLobbyState> = {
    message: newMatchState,
    timestamp: Date.now(),
    topic: `${WebSocketChannel.Matches}:${channelId}:${WebSocketChannelMatchesEvent.LobbyState}`,
  };

  webSocketServer.broadcastMessageToSubscribers(
    Buffer.from(JSON.stringify(payload)),
    { isBinary: false, isBanchoMessage: true },
  );
};
