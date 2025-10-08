/**
 * Convert a game match ID to a Bancho multiplayer channel name.
 */
export const banchoChannelFromGameMatchId = (gameMatchId: number): string => {
  return `#mp_${gameMatchId}`;
};

/**
 * Useful for retrying operations with increasing delays.
 */
export const exponentialBackoffDelay = (options: {
  attempt: number;
  baseDelay?: number;
  factor?: number;
  maxDelay?: number;
}): number => {
  const { attempt, baseDelay = 1000, maxDelay = 30_000, factor = 2 } = options;

  if (attempt < 0 || !Number.isInteger(attempt)) {
    throw new Error('Attempt must be a positive integer');
  }

  return Math.min(baseDelay * factor ** attempt, maxDelay);
};

/**
 * Format UTC timestamp to a human-readable string in `HH:mm:ss` format.
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
    // TODO: Add Timezone support based on https://timezonedb.com/time-zones
    timeZone: 'UTC',
  }).format(timestamp);
};
