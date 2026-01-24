import { BanchoClient, BanchoClientEvent } from '@packages/bancho-client';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { onBotConnected } from '#src/services/bancho/events/onBotConnectedEvent.js';
import { onBotDisconnected } from '#src/services/bancho/events/onBotDisconnectedEvent.js';
import { onBotJoinedChannel } from '#src/services/bancho/events/onBotJoinedChannelEvent.js';
import { onChannelMessage } from '#src/services/bancho/events/onChannelMessageEvent.js';
import { onConcurrentMatchLimitReached } from '#src/services/bancho/events/onConcurrentMatchLimitReachedEvent.js';
import { onMultiplayerChannelAllPlayersReady } from '#src/services/bancho/events/onMultiplayerChannelAllPlayersReadyEvent.js';
import { onMultiplayerChannelClosed } from '#src/services/bancho/events/onMultiplayerChannelClosedEvent.js';
import { onMultiplayerChannelHostChanged } from '#src/services/bancho/events/onMultiplayerChannelHostChangedEvent.js';
import { onMultiplayerChannelHostCleared } from '#src/services/bancho/events/onMultiplayerChannelHostClearedEvent.js';
import { onMultiplayerChannelInformationConditions } from '#src/services/bancho/events/onMultiplayerChannelInformationConditionsEvent.js';
import { onMultiplayerChannelInformationCurrentlyPlaying } from '#src/services/bancho/events/onMultiplayerChannelInformationCurrentlyPlayingEvent.js';
import { onMultiplayerChannelInformationGlobalModifications } from '#src/services/bancho/events/onMultiplayerChannelInformationGlobalModificationsEvent.js';
import { onMultiplayerChannelInformationIdentity } from '#src/services/bancho/events/onMultiplayerChannelInformationIdentityEvent.js';
import { onMultiplayerChannelInformationPlayerCount } from '#src/services/bancho/events/onMultiplayerChannelInformationPlayerCountEvent.js';
import { onMultiplayerChannelInformationSlot } from '#src/services/bancho/events/onMultiplayerChannelInformationSlotEvent.js';
import { onMultiplayerChannelNameUpdated } from '#src/services/bancho/events/onMultiplayerChannelNameUpdatedEvent.js';
import { onMultiplayerPayerLeftRoom } from '#src/services/bancho/events/onMultiplayerPayerLeftRoomEvent.js';
import { onMultiplayerPlayerJoinedSlot } from '#src/services/bancho/events/onMultiplayerPlayerJoinedSlotEvent.js';
import { onMultiplayerPlayerMovedSlot } from '#src/services/bancho/events/onMultiplayerPlayerMovedSlotEvent.js';

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
  BanchoClientEvent.MultiplayerChannelAllPlayersReady,
  onMultiplayerChannelAllPlayersReady,
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
  BanchoClientEvent.MultiplayerChannelHostCleared,
  onMultiplayerChannelHostCleared,
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
