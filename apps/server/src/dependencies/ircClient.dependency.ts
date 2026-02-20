import { BanchoClient, BanchoClientEvent } from '@packages/bancho-client';

import { environmentConfig } from '#src/configs/environment.config.js';
import { sequencer } from '#src/dependencies/sequencer.dependency.js';
import { onBotConnected } from '#src/services/bancho/events/bancho.onBotConnected.event.js';
import { onBotDisconnected } from '#src/services/bancho/events/bancho.onBotDisconnected.event.js';
import { onBotJoinedChannel } from '#src/services/bancho/events/bancho.onBotJoinedChannel.event.js';
import { onChannelMessage } from '#src/services/bancho/events/bancho.onChannelMessage.event.js';
import { onConcurrentMatchLimitReached } from '#src/services/bancho/events/bancho.onConcurrentMatchLimitReached.event.js';
import { onMultiplayerChannelAllPlayersReady } from '#src/services/bancho/events/bancho.onMultiplayerChannelAllPlayersReady.event.js';
import { onMultiplayerChannelClosed } from '#src/services/bancho/events/bancho.onMultiplayerChannelClosed.event.js';
import { onMultiplayerChannelHostChanged } from '#src/services/bancho/events/bancho.onMultiplayerChannelHostChanged.event.js';
import { onMultiplayerChannelHostCleared } from '#src/services/bancho/events/bancho.onMultiplayerChannelHostCleared.event.js';
import { onMultiplayerChannelInformationConditions } from '#src/services/bancho/events/bancho.onMultiplayerChannelInformationConditions.event.js';
import { onMultiplayerChannelInformationCurrentlyPlaying } from '#src/services/bancho/events/bancho.onMultiplayerChannelInformationCurrentlyPlaying.event.js';
import { onMultiplayerChannelInformationGlobalModifications } from '#src/services/bancho/events/bancho.onMultiplayerChannelInformationGlobalModifications.event.js';
import { onMultiplayerChannelInformationIdentity } from '#src/services/bancho/events/bancho.onMultiplayerChannelInformationIdentity.event.js';
import { onMultiplayerChannelInformationPlayerCount } from '#src/services/bancho/events/bancho.onMultiplayerChannelInformationPlayerCount.event.js';
import { onMultiplayerChannelInformationSlot } from '#src/services/bancho/events/bancho.onMultiplayerChannelInformationSlot.event.js';
import { onMultiplayerChannelNameUpdated } from '#src/services/bancho/events/bancho.onMultiplayerChannelNameUpdated.event.js';
import { onMultiplayerPayerLeftRoom } from '#src/services/bancho/events/bancho.onMultiplayerPayerLeftRoom.event.js';
import { onMultiplayerPlayerJoinedSlot } from '#src/services/bancho/events/bancho.onMultiplayerPlayerJoinedSlot.event.js';
import { onMultiplayerPlayerMovedSlot } from '#src/services/bancho/events/bancho.onMultiplayerPlayerMovedSlot.event.js';

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
