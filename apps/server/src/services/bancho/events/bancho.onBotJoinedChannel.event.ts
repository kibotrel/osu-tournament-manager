import { logger } from '#src/dependencies/logger.dependency.js';

export const onBotJoinedChannelEvent = ({ channel }: { channel: string }) => {
  logger.debug(`[IRC] Joined ${channel}`);
};
