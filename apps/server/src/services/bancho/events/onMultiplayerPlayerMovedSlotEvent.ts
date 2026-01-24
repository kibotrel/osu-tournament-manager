import type {
  BanchoLobbyState,
  WebSocketMatchLobbyState,
  WebSocketMessage,
} from '@packages/shared';
import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  gameMatchIdFromBanchoChannel,
} from '@packages/shared';

import { baseSlot } from '#src/constants/banchoConstants.js';
import { logger } from '#src/dependencies/loggerDependency.js';
import { setMatchStateInCache } from '#src/services/cache/cacheService.js';
import { getMatchStateService } from '#src/services/matches/matchesService.js';
import { webSocketServer } from '#src/websocketServer.js';

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
