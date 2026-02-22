import { BanchoClient, BanchoClientEvent } from '@packages/bancho-client';

import { environmentConfig } from '#src/configs/environment.config.js';
import { sequencer } from '#src/dependencies/sequencer.dependency.js';
import { onBotConnectedEvent } from '#src/services/bancho/events/bancho.onBotConnected.event.js';
import { onBotDisconnectedEvent } from '#src/services/bancho/events/bancho.onBotDisconnected.event.js';
import { onBotJoinedChannelEvent } from '#src/services/bancho/events/bancho.onBotJoinedChannel.event.js';
import { onChannelMessageEvent } from '#src/services/bancho/events/bancho.onChannelMessage.event.js';
import { onConcurrentMatchLimitReachedEvent } from '#src/services/bancho/events/bancho.onConcurrentMatchLimitReached.event.js';
import { onMultiplayerChannelAllPlayersReadyEvent } from '#src/services/bancho/events/bancho.onMultiplayerChannelAllPlayersReady.event.js';
import { onMultiplayerChannelClosedEvent } from '#src/services/bancho/events/bancho.onMultiplayerChannelClosed.event.js';
import { onMultiplayerChannelHostChangedEvent } from '#src/services/bancho/events/bancho.onMultiplayerChannelHostChanged.event.js';
import { onMultiplayerChannelHostClearedEvent } from '#src/services/bancho/events/bancho.onMultiplayerChannelHostCleared.event.js';
import { onMultiplayerChannelInformationConditionsEvent } from '#src/services/bancho/events/bancho.onMultiplayerChannelInformationConditions.event.js';
import { onMultiplayerChannelInformationCurrentlyPlayingEvent } from '#src/services/bancho/events/bancho.onMultiplayerChannelInformationCurrentlyPlaying.event.js';
import { onMultiplayerChannelInformationGlobalModificationsEvent } from '#src/services/bancho/events/bancho.onMultiplayerChannelInformationGlobalModifications.event.js';
import { onMultiplayerChannelInformationIdentityEvent } from '#src/services/bancho/events/bancho.onMultiplayerChannelInformationIdentity.event.js';
import { onMultiplayerChannelInformationPlayerCountEvent } from '#src/services/bancho/events/bancho.onMultiplayerChannelInformationPlayerCount.event.js';
import { onMultiplayerChannelInformationSlotEvent } from '#src/services/bancho/events/bancho.onMultiplayerChannelInformationSlot.event.js';
import { onMultiplayerChannelNameUpdatedEvent } from '#src/services/bancho/events/bancho.onMultiplayerChannelNameUpdated.event.js';
import { onMultiplayerPayerLeftRoomEvent } from '#src/services/bancho/events/bancho.onMultiplayerPayerLeftRoom.event.js';
import { onMultiplayerPlayerJoinedSlotEvent } from '#src/services/bancho/events/bancho.onMultiplayerPlayerJoinedSlot.event.js';
import { onMultiplayerPlayerMovedSlotEvent } from '#src/services/bancho/events/bancho.onMultiplayerPlayerMovedSlot.event.js';

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

banchoClient.on(BanchoClientEvent.BotConnected, onBotConnectedEvent);
banchoClient.on(BanchoClientEvent.BotDisconnected, onBotDisconnectedEvent);
banchoClient.on(BanchoClientEvent.BotJoinedChannel, onBotJoinedChannelEvent);
banchoClient.on(BanchoClientEvent.ChannelMessage, onChannelMessageEvent);
banchoClient.on(
  BanchoClientEvent.ConcurrentMatchLimitReached,
  onConcurrentMatchLimitReachedEvent,
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelAllPlayersReady,
  enqueueChannelEvent(onMultiplayerChannelAllPlayersReadyEvent),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelClosed,
  enqueueChannelEvent(onMultiplayerChannelClosedEvent),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelHostChanged,
  enqueueChannelEvent(onMultiplayerChannelHostChangedEvent),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelHostCleared,
  enqueueChannelEvent(onMultiplayerChannelHostClearedEvent),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationIdentity,
  enqueueChannelEvent(onMultiplayerChannelInformationIdentityEvent),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationCurrentlyPlaying,
  enqueueChannelEvent(onMultiplayerChannelInformationCurrentlyPlayingEvent),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationConditions,
  enqueueChannelEvent(onMultiplayerChannelInformationConditionsEvent),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationGlobalModifications,
  enqueueChannelEvent(onMultiplayerChannelInformationGlobalModificationsEvent),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationPlayerCount,
  enqueueChannelEvent(onMultiplayerChannelInformationPlayerCountEvent),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelInformationSlot,
  enqueueChannelEvent(onMultiplayerChannelInformationSlotEvent),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerChannelNameUpdated,
  enqueueChannelEvent(onMultiplayerChannelNameUpdatedEvent),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerPlayerJoinedSlot,
  enqueueChannelEvent(onMultiplayerPlayerJoinedSlotEvent),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerPayerLeftRoom,
  enqueueChannelEvent(onMultiplayerPayerLeftRoomEvent),
);
banchoClient.on(
  BanchoClientEvent.MultiplayerPlayerMovedSlot,
  enqueueChannelEvent(onMultiplayerPlayerMovedSlotEvent),
);

export { banchoClient };
