import { BanchoClient, BanchoClientEvent } from '@packages/bancho-client';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import {
  onBotConnected,
  onBotDisconnected,
  onBotJoinedChannel,
  onChannelMessage,
  onConcurrentMatchLimitReached,
  onMultiplayerChannelClosed,
  onMultiplayerChannelHostChanged,
  onMultiplayerChannelInformationConditions,
  onMultiplayerChannelInformationCurrentlyPlaying,
  onMultiplayerChannelInformationGlobalModifications,
  onMultiplayerChannelInformationIdentity,
  onMultiplayerChannelInformationPlayerCount,
  onMultiplayerChannelInformationSlot,
  onMultiplayerChannelNameUpdated,
  onMultiplayerPayerLeftRoom,
  onMultiplayerPlayerJoinedSlot,
  onMultiplayerPlayerMovedSlot,
} from '#src/services/bancho/eventsService.js';

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

banchoClient.on(BanchoClientEvent.BotConnected, onBotConnected);
banchoClient.on(BanchoClientEvent.BotDisconnected, () => {
  onBotDisconnected(banchoClient);
});
banchoClient.on(BanchoClientEvent.BotJoinedChannel, onBotJoinedChannel);
banchoClient.on(BanchoClientEvent.ChannelMessage, onChannelMessage);
banchoClient.on(
  BanchoClientEvent.ConcurrentMatchLimitReached,
  onConcurrentMatchLimitReached,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelClosed,
  onMultiplayerChannelClosed,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelHostChanged,
  onMultiplayerChannelHostChanged,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationIdentity,
  onMultiplayerChannelInformationIdentity,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationCurrentlyPlaying,
  onMultiplayerChannelInformationCurrentlyPlaying,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationConditions,
  onMultiplayerChannelInformationConditions,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationGlobalModifications,
  onMultiplayerChannelInformationGlobalModifications,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationPlayerCount,
  onMultiplayerChannelInformationPlayerCount,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationSlot,
  onMultiplayerChannelInformationSlot,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelNameUpdated,
  onMultiplayerChannelNameUpdated,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerPlayerJoinedSlot,
  onMultiplayerPlayerJoinedSlot,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerPayerLeftRoom,
  onMultiplayerPayerLeftRoom,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerPlayerMovedSlot,
  onMultiplayerPlayerMovedSlot,
);

export { banchoClient };
