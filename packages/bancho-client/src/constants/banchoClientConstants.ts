export enum BanchoClientEvent {
  AddChannelMembers = 'add_channel_members',
  BotConnected = 'bot_connected',
  BotDisconnected = 'bot_disconnected',
  BotJoinedChannel = 'bot_joined_channel',
  BotSentMessage = 'bot_sent_message',
  ChannelMessage = 'channel_message',
  ChannelNotFound = 'channel_not_found',
  ConcurrentMatchLimitReached = 'concurrent_match_limit_reached',
  MultiplayerChannelClosed = 'multiplayer_channel_closed',
  MultiplayerChannelInformationConditions = 'multiplayer_channel_information_conditions',
  MultiplayerChannelInformationCurrentlyPlaying = 'multiplayer_channel_information_currently_playing',
  MultiplayerChannelInformationGlobalModifications = 'multiplayer_channel_information_global_modifications',
  MultiplayerChannelInformationIdentity = 'multiplayer_channel_information_identity',
  MultiplayerChannelInformationPlayerCount = 'multiplayer_channel_information_player_count',
  MultiplayerChannelInformationSlot = 'multiplayer_channel_information_slot',
  MultiplayerChannelNameUpdated = 'multiplayer_channel_name_updated',
  RecipientNotFound = 'recipient_not_found',
  UserAlreadyInChannel = 'user_already_in_channel',
  UserDisconnected = 'user_disconnected',
  UserInvitedToChannel = 'user_invited_to_channel',
  UserJoinedChannel = 'user_joined_channel',
  UserLeftChannel = 'user_left_channel',
  UserNotFound = 'user_not_found',
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

/**
 * List of messages that the Bancho bot can send in response to a command.
 */
export enum BanchoBotCommonMessage {
  ChangedBeatmap = '^Changed beatmap to (?<url>\\S+) (?<beatmap>.+)$',
  ClosedMatch = '^Closed the match$',
  ConcurrentMatchLimitReached = '^You cannot create any more tournament matches. Please close any previous tournament matches you have open.$',
  CurrentlyPlaying = '^Beatmap: (?<url>\\S+) (?<beatmap>.+)$',
  GlobalActiveModifications = '^Active mods: (?<modifications>.+)$',
  InvitedUserToChannel = '^Invited (?<user>\\S+) to the room$',
  MatchConditions = '^Team mode: (?<teamMode>\\S+), Win condition: (?<winCondition>\\S+)$',
  MatchCreation = '^Created the tournament match (?<historyUrl>\\S+)\\s+(?<name>.+)$',
  MatchSlot = '^Slot (?<slotNumber>\\d+)\\s+(?<status>Not Ready|Ready)\\s+https:\\/\\/osu\\.ppy\\.sh\\/u\\/(?<gameUserId>\\d+)\\s+(?<user>.+?)\\s*(\\[(?<attributes>.+)\\])?$',
  PlayerCount = '^Players: (?<playerCount>\\d+)$',
  RoomIdentification = '^Room name: (?<name>.+), History: (?<historyUrl>\\S+)$',
  RoomNameUpdated = '^Room name updated to "(?<name>.+)"$',
  UserAlreadyInChannel = '^User is already in the room$',
  UserNotFound = '^User not found$',
}

export enum BanchoUser {
  BanchoBot = 'BanchoBot',
}

export enum BanchoPublicChannel {
  Lobby = '#lobby',
}

export enum BanchoReadyStatus {
  NotReady = 'Not Ready',
  Ready = 'Ready',
}

export enum BanchoTerm {
  Host = 'Host',
}
