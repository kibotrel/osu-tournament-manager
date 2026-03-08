import { logger } from '#src/dependencies/logger.dependency.js';
import { joinAllOngoingMatchesService } from '#src/services/bancho/bancho.multiplayer.service.js';

export const onBotConnectedEvent = async () => {
  logger.silly('[IRC] Connected to the osu! server');

  await joinAllOngoingMatchesService();
};
