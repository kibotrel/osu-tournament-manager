import { BanchoClient, BanchoClientEvent } from '@packages/bancho-client';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { logger } from '#src/dependencies/loggerDependency.js';
import { closeExpiredMultiplayerChannel } from '#src/services/bancho/multiplayerService.js';
import { broadcastBanchoMessage } from '#src/services/websockets/websocketsService.js';

const banchoClient = new BanchoClient({
  clientCredentials: {
    username: environmentConfig.osuIrcClientUsername,
    password: environmentConfig.osuIrcClientPassword,
  },
  serverInformation: {
    host: environmentConfig.osuIrcServerHostname,
    port: environmentConfig.osuIrcServerPort,
  },
});

banchoClient.on(BanchoClientEvent.BotConnected, () => {
  logger.debug('[IRC] Connected to the osu! server.');
});

banchoClient.on(BanchoClientEvent.BotDisconnected, async () => {
  logger.debug('[IRC] Disconnected from osu! server');

  await banchoClient.connect();
});

banchoClient.on(BanchoClientEvent.BotJoinedChannel, ({ channel }) => {
  logger.debug(`[IRC] Joined ${channel}.`);
});

banchoClient.on(BanchoClientEvent.ChannelMessage, broadcastBanchoMessage);

banchoClient.on(
  BanchoClientEvent.MultiplayerChannelClosed,
  closeExpiredMultiplayerChannel,
);

banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationIdentity,
  ({ channel, name, historyUrl }) => {
    logger.debug(`[IRC] channel ${channel} information updated`, {
      historyUrl,
      name,
    });
  },
);

banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationCurrentlyPlaying,
  ({ beatmap, channel, url }) => {
    logger.debug(
      `[IRC] channel ${channel} is currently playing ${beatmap} (${url})`,
    );
  },
);

banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationConditions,
  ({ channel, teamMode, winCondition }) => {
    logger.debug(`[IRC] channel ${channel} conditions updated`, {
      teamMode,
      winCondition,
    });
  },
);

banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationGlobalModifications,
  ({ channel, modifications }) => {
    logger.debug(`[IRC] channel ${channel} global modifications updated`, {
      modifications,
    });
  },
);

banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationPlayerCount,
  ({ channel, playerCount }) => {
    logger.debug(`[IRC] channel ${channel} player count updated`, {
      playerCount,
    });
  },
);

banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationSlot,
  ({
    channel,
    gameUserId,
    isHost,
    isReady,
    modifications,
    slotNumber,
    user,
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
  },
);

export { banchoClient };
