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

/**
 * Convert a game match ID to a Bancho multiplayer channel name.
 */
export const banchoChannelFromGameMatchId = (gameMatchId: number): string => {
  return `#mp_${gameMatchId}`;
};
