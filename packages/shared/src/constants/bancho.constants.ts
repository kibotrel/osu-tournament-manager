export const BANCHO_LOBBY_SIZE = 16;

/**
 * Commands that can be used to manage a tournament match.
 * See [the osu! Tournament management commands wiki](https://osu.ppy.sh/wiki/en/osu%21_tournament_client/osu%21tourney/Tournament_management_commands)
 * for more information.
 */
export enum BanchoCommand {
  AbortMatch = '!mp abort',
  AbortTimer = '!mp aborttimer',
  ClearHost = '!mp clearhost',
  CloseMatch = '!mp close',
  CreateTournamentMatch = '!mp make',
  GetMatchSettings = '!mp settings',
  InvitePlayer = '!mp invite',
  KickPlayer = '!mp kick',
  LockMatchState = '!mp lock',
  MovePlayer = '!mp move',
  SetBeatmap = '!mp map',
  SetLobbySize = '!mp size',
  SetMatchProperty = '!mp set',
  SetMods = '!mp mods',
  SetPlayerTeam = '!mp team',
  StartMatch = '!mp start',
  StartTimer = '!mp timer',
  TransferHost = '!mp host',
}

export enum BanchoTeamMode {
  HeadToHead = 'HeadToHead',
  TagCoOp = 'TagCoOp',
  TagTeamVs = 'TagTeamVs',
  TeamVs = 'TeamVs',
}

export enum BanchoWinCondition {
  Accuracy = 'Accuracy',
  Combo = 'Combo',
  Score = 'Score',
  ScoreV2 = 'ScoreV2',
}
