import { BanchoClient, BanchoClientEvent } from '@packages/bancho-client';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { sequencer } from '#src/dependencies/sequencerDependency.js';
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

const enqueueChannelEvent = <T extends { channel: string }>(
  handler: (options: T) => Promise<void> | void,
) => {
  return (options: T) => {
    const { channel } = options;

    sequencer.enqueueTask(
      async () => {
        await handler(options);
      },
      { name: handler.name, queueId: channel },
    );
  };
};

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
banchoClient.on(BanchoClientEvent.BotDisconnected, onBotDisconnected);
banchoClient.on(BanchoClientEvent.BotJoinedChannel, onBotJoinedChannel);
banchoClient.on(BanchoClientEvent.ChannelMessage, onChannelMessage);
banchoClient.on(
  BanchoClientEvent.ConcurrentMatchLimitReached,
  onConcurrentMatchLimitReached,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelAllPlayersReady,
  enqueueChannelEvent(onMultiplayerChannelAllPlayersReady),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelClosed,
  enqueueChannelEvent(onMultiplayerChannelClosed),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelHostChanged,
  enqueueChannelEvent(onMultiplayerChannelHostChanged),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelHostCleared,
  enqueueChannelEvent(onMultiplayerChannelHostCleared),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationIdentity,
  enqueueChannelEvent(onMultiplayerChannelInformationIdentity),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationCurrentlyPlaying,
  enqueueChannelEvent(onMultiplayerChannelInformationCurrentlyPlaying),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationConditions,
  enqueueChannelEvent(onMultiplayerChannelInformationConditions),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationGlobalModifications,
  enqueueChannelEvent(onMultiplayerChannelInformationGlobalModifications),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationPlayerCount,
  enqueueChannelEvent(onMultiplayerChannelInformationPlayerCount),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationSlot,
  enqueueChannelEvent(onMultiplayerChannelInformationSlot),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelNameUpdated,
  enqueueChannelEvent(onMultiplayerChannelNameUpdated),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerPlayerJoinedSlot,
  enqueueChannelEvent(onMultiplayerPlayerJoinedSlot),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerPayerLeftRoom,
  enqueueChannelEvent(onMultiplayerPayerLeftRoom),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerPlayerMovedSlot,
  enqueueChannelEvent(onMultiplayerPlayerMovedSlot),
);

export { banchoClient };
