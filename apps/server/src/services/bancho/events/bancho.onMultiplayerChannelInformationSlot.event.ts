import type {
  BanchoLobbyState,
  OsuBeatmapModification,
  WebSocketMatchLobbyState,
  WebSocketMessage,
} from '@packages/shared';
import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  gameMatchIdFromBanchoChannel,
} from '@packages/shared';

import { logger } from '#src/dependencies/logger.dependency.js';
import { setMatchStateInCacheService } from '#src/services/cache/cache.service.js';
import { getMatchStateService } from '#src/services/matches/matches.service.js';
import { webSocketServer } from '#src/websocketServer.js';

export const onMultiplayerChannelInformationSlotEvent = async ({
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
  modifications: OsuBeatmapModification[];
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
      selectedModifications: modifications,
    }),
  };

  await setMatchStateInCacheService({
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
