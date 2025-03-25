export enum BanchoClientEvent {
  AddChannelMembers = 'add_channel_members',
  BotConnected = 'bot_connected',
  BotDisconnected = 'bot_disconnected',
  BotJoinedChannel = 'bot_joined_channel',
  BotSentMessage = 'bot_sent_message',
  ChannelMessage = 'channel_message',
  ChannelNotFound = 'channel_not_found',
  MultiplayerChannelClosed = 'multiplayer_channel_closed',
  RecipientNotFound = 'recipient_not_found',
  UserDisconnected = 'user_disconnected',
  UserJoinedChannel = 'user_joined_channel',
  UserLeftChannel = 'user_left_channel',
}

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

export enum BanchoPublicChannel {
  Lobby = '#lobby',
}
