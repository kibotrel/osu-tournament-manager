/**
 * Extract the match ID from a Bancho multiplayer channel.
 */
export const gameMatchIdFromBanchoChannel = (channel: string): number => {
  if (channel.length <= 4) {
    return Number.NaN;
  }

  const id = Number(channel.slice(4));

  if (!Number.isFinite(id)) {
    return Number.NaN;
  }

  return id;
};
