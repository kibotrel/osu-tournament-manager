import { IrcKeyword } from './ircConstants.js';

export enum BanchoClientEvent {
  AddChannelMembers = 'add_channel_members',
  Connected = 'connected',
  JoinedChannel = 'joined_channel',
  UserDisconnected = 'user_disconnected',
}

export const BANCHO_HOST = 'irc.ppy.sh';

export const BANCHO_MESSAGE_PING = `${IrcKeyword.Ping} ${BANCHO_HOST}`;
