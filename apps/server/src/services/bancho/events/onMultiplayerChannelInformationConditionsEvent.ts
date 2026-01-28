import type {
  BanchoLobbyState,
  BanchoTeamMode,
  BanchoWinCondition,
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

export const onMultiplayerChannelInformationConditions = async ({
  channel,
  teamMode,
  winCondition,
}: {
  channel: string;
  teamMode: BanchoTeamMode;
  winCondition: BanchoWinCondition;
}) => {
  logger.debug(`[IRC] channel ${channel} conditions updated`, {
    teamMode,
    winCondition,
  });

  const channelId = gameMatchIdFromBanchoChannel(channel);
  const oldMatchState = await getMatchStateService(channelId);
  const newMatchState: BanchoLobbyState = {
    ...oldMatchState,
    teamMode,
    winCondition,
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
