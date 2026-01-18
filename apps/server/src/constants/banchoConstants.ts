import type { BanchoLobbySlot, BanchoLobbyState } from '@packages/shared';
import { BANCHO_LOBBY_SIZE } from '@packages/shared';

export const baseSlot: BanchoLobbySlot = {
  isHost: false,
  isReady: false,
  player: null,
  selectedModifications: [],
};

export const baseMatchState: BanchoLobbyState = {
  globalModifications: [],
  playerCount: 0,
  slots: Array.from({ length: BANCHO_LOBBY_SIZE }, () => {
    return { ...baseSlot };
  }),
};
