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

export const onMultiplayerPlayerJoinedSlotEvent = async ({
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
