import { logger } from '#src/dependencies/logger.dependency.js';

export const onBotJoinedChannel = ({ channel }: { channel: string }) => {
  logger.debug(`[IRC] Joined ${channel}`);
};
