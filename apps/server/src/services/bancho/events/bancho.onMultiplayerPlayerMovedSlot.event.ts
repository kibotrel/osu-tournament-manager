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

import { baseSlot } from '#src/constants/bancho.constants.js';
import { logger } from '#src/dependencies/logger.dependency.js';
import { setMatchStateInCacheService } from '#src/services/cache/cache.service.js';
import { getMatchStateService } from '#src/services/matches/matches.service.js';
import { webSocketServer } from '#src/websocketServer.js';

export const onMultiplayerPlayerMovedSlotEvent = async ({
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
