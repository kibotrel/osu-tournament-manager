import { BANCHO_LOBBY_SIZE, type BanchoLobbyState } from '@packages/shared';

export const baseMatchState: BanchoLobbyState = {
  globalModifications: [],
  playerCount: 0,
  slots: Array.from({ length: BANCHO_LOBBY_SIZE }, () => {
    return {
      isHost: false,
      isReady: false,
      player: null,
      selectedModifications: [],
    };
  }),
};
