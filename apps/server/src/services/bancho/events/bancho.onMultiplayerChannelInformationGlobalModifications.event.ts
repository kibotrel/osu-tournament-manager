import type {
  BanchoLobbyState,
  WebSocketMatchLobbyState,
  WebSocketMessage,
} from '@packages/shared';
import {
  OsuBeatmapModification,
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  gameMatchIdFromBanchoChannel,
} from '@packages/shared';

import { logger } from '#src/dependencies/logger.dependency.js';
import { setMatchStateInCacheService } from '#src/services/cache/cache.service.js';
import { getMatchStateService } from '#src/services/matches/matches.service.js';
import { webSocketServer } from '#src/websocketServer.js';

export const onMultiplayerChannelInformationGlobalModificationsEvent = async ({
  channel,
  modifications,
}: {
  channel: string;
  modifications: OsuBeatmapModification[];
}) => {
  logger.debug(`[IRC] channel ${channel} global modifications updated`, {
    modifications,
  });

  const filteredOutModifications = new Set([
    OsuBeatmapModification.FreeModification,
  ]);

  if (modifications.includes(OsuBeatmapModification.Nightcore)) {
    filteredOutModifications.add(OsuBeatmapModification.DoubleTime);
  }

  const sanitizedModifications = modifications.filter((modification) => {
    return !filteredOutModifications.has(modification);
  });
  const channelId = gameMatchIdFromBanchoChannel(channel);
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = {
    ...oldMatchState,
    globalModifications: sanitizedModifications,
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
