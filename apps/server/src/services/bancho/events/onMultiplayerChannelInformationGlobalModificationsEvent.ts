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

import { logger } from '#src/dependencies/loggerDependency.js';
import { setMatchStateInCache } from '#src/services/cache/cacheService.js';
import { getMatchStateService } from '#src/services/matches/matchesService.js';
import { webSocketServer } from '#src/websocketServer.js';

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
