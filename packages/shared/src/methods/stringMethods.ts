/**
 * Extract the match ID from a Bancho multiplayer channel.
 */
export const gameMatchIdFromBanchoChannel = (channel: string): number => {
  return Number(channel.slice(4));
};
