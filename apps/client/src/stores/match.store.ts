import type { BanchoLobbyState } from '@packages/shared';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export type MatchState = BanchoLobbyState;

export const useMatchStore = defineStore('match', () => {
  const defaultState: BanchoLobbyState = {
    globalModifications: [],
    playerCount: 0,
    slots: [],
  };
  const match = reactive<MatchState>({ ...defaultState });

  const setMatch = (newMatch: MatchState) => {
    Object.assign(match, newMatch);
  };

  return { match, setMatch };
});
