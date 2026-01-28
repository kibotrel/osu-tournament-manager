import type { OsuBeatmapModification } from '#src/constants/osuConstants.js';
import type { BanchoTeamMode, BanchoWinCondition } from '#src/sharedExport.js';

export interface BanchoLobbySlot {
  isHost: boolean;
  isReady: boolean;
  player: string | null;
  selectedModifications: OsuBeatmapModification[];
}

export interface BanchoLobbyState {
  globalModifications: OsuBeatmapModification[];
  playerCount: number;
  slots: BanchoLobbySlot[];
  activeBeatmap?: { name: string; url: string };
  historyUrl?: string;
  name?: string;
  teamMode?: BanchoTeamMode;
  winCondition?: BanchoWinCondition;
}
