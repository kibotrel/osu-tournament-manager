import { logger } from '#src/dependencies/logger.dependency.js';
import { joinAllOngoingMatches } from '#src/services/bancho/bancho.multiplayer.service.js';

export const onBotConnected = async () => {
  logger.debug('[IRC] Connected to the osu! server');

  await joinAllOngoingMatches();
};
