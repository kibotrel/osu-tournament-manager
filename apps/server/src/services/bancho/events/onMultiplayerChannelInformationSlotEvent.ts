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

import { logger } from '#src/dependencies/loggerDependency.js';
import { setMatchStateInCache } from '#src/services/cache/cacheService.js';
import { getMatchStateService } from '#src/services/matches/matchesService.js';
import { webSocketServer } from '#src/websocketServer.js';

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
