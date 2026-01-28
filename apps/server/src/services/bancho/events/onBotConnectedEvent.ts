import { logger } from '#src/dependencies/loggerDependency.js';
import { joinAllOngoingMatches } from '#src/services/bancho/multiplayerService.js';

export const onBotConnected = async () => {
  logger.debug('[IRC] Connected to the osu! server');

  await joinAllOngoingMatches();
};
