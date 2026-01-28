import { logger } from '#src/dependencies/loggerDependency.js';

export const onBotJoinedChannel = ({ channel }: { channel: string }) => {
  logger.debug(`[IRC] Joined ${channel}`);
};
