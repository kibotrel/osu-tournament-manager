import { afterEach, describe, expect, it, vi } from 'vitest';

import { BanchoClient } from '#src/classes/ircClient.class.js';
import { IrcCommandPrivateMessage } from '#src/classes/ircCommandPrivateMessage.class.js';

describe('IrcCommandPrivateMessage', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });

  describe('constructor', () => {
    it('should create an instance of IrcCommandPrivateMessage', () => {
      const packetParts = [
        'username!server@localhost.dev PRIVMSG #channel',
        'message content',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);

      expect(command).toBeInstanceOf(IrcCommandPrivateMessage);
      expect(command).toHaveProperty('banchoClient', banchoClient);
      expect(command).toHaveProperty('packetParts', packetParts);
      expect(command).toHaveProperty('banchoBotEvents', expect.any(Array));
      // eslint-disable-next-line dot-notation
      expect(command['banchoBotEvents'].length).toBe(20);
    });
  });

  describe('handleCommand', () => {
    afterEach(() => {
      vi.resetAllMocks();
    });

    it('should emit channel_message event with the channel, message and user', () => {
      const packetParts = [
        'username!server@localhost.dev PRIVMSG #channel',
        'message content',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(2);
      expect(eventEmitter).toHaveBeenCalledWith('channel_message', {
        channel: '#channel',
        message: 'message content',
        user: 'username',
      });
      expect(eventEmitter).toHaveBeenCalledWith('channel_message:#channel', {
        message: 'message content',
        user: 'username',
      });
    });

    it('should also emit concurrent_match_limit_reached event if sender is BanchoBot and received message is a concurrent match limit reached notice', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'You cannot create any more tournament matches. Please close any previous tournament matches you have open.',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(3);
      expect(eventEmitter).toHaveBeenCalledWith(
        'concurrent_match_limit_reached',
      );
    });

    it('should also emit multiplayer_channel_all_players_ready event if sender is BanchoBot and received message indicating all players are ready', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'All players are ready',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_all_players_ready',
        { channel: '#channel' },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_all_players_ready:#channel',
      );
    });

    it('should also emit multiplayer_channel_closed event if sender is BanchoBot and received message is a multiplayer match closing notice', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Closed the match',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith('multiplayer_channel_closed', {
        channel: '#channel',
      });
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_closed:#channel',
      );
    });

    it('should also emit multiplayer_channel_host_changed event if sender is BanchoBot and received message containing new match host', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'player1 became the host.',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_host_changed',
        { channel: '#channel', newHost: 'player1' },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_host_changed:#channel',
        { newHost: 'player1' },
      );
    });

    it('should also emit multiplayer_channel_host_cleared event if sender is BanchoBot and received message indicating host has been cleared', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Cleared match host',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_host_cleared',
        { channel: '#channel' },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_host_cleared:#channel',
      );
    });

    it('should also emit multiplayer_channel_information_conditions event if sender is BanchoBot and received message containing match conditions', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Team mode: HeadToHead, Win condition: ScoreV2',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_conditions',
        {
          channel: '#channel',
          teamMode: 'HeadToHead',
          winCondition: 'ScoreV2',
        },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_conditions:#channel',
        { teamMode: 'HeadToHead', winCondition: 'ScoreV2' },
      );
    });

    it('should also emit multiplayer_channel_information_currently_playing event if sender is BanchoBot and received message containing changed beatmap', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Changed beatmap to https://osu.ppy.sh/beatmapsets/1381917#mania/2855263 Glamour Of The Kill - A Hope In Hell',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_currently_playing',
        {
          channel: '#channel',
          beatmap: 'Glamour Of The Kill - A Hope In Hell',
          url: 'https://osu.ppy.sh/beatmapsets/1381917#mania/2855263',
        },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_currently_playing:#channel',
        {
          beatmap: 'Glamour Of The Kill - A Hope In Hell',
          url: 'https://osu.ppy.sh/beatmapsets/1381917#mania/2855263',
        },
      );
    });

    it('should also emit multiplayer_channel_information_currently_playing event if sender is BanchoBot and received message containing currently playing beatmap', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Beatmap: https://osu.ppy.sh/beatmapsets/1381917#mania/2855263 Glamour Of The Kill - A Hope In Hell',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_currently_playing',
        {
          channel: '#channel',
          beatmap: 'Glamour Of The Kill - A Hope In Hell',
          url: 'https://osu.ppy.sh/beatmapsets/1381917#mania/2855263',
        },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_currently_playing:#channel',
        {
          beatmap: 'Glamour Of The Kill - A Hope In Hell',
          url: 'https://osu.ppy.sh/beatmapsets/1381917#mania/2855263',
        },
      );
    });

    it('should also emit multiplayer_channel_information_global_modifications event if sender is BanchoBot and received message containing global active modifications', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Active mods: Hidden, HardRock',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_global_modifications',
        { channel: '#channel', modifications: ['Hidden', 'HardRock'] },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_global_modifications:#channel',
        { modifications: ['Hidden', 'HardRock'] },
      );
    });

    it('should also emit multiplayer_channel_information_identity event if sender is BanchoBot and received message containing match creation notice', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Created the tournament match https://osu.ppy.sh/mp/123456 match name',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_identity',
        {
          channel: '#mp_123456',
          name: 'match name',
          historyUrl: 'https://osu.ppy.sh/mp/123456',
        },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_identity:#mp_123456',
        { name: 'match name', historyUrl: 'https://osu.ppy.sh/mp/123456' },
      );
    });

    it('should also emit multiplayer_channel_information_identity event if sender is BanchoBot and received message containing room identification', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Room name: match name, History: https://osu.ppy.sh/mp/123456',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_identity',
        {
          channel: '#channel',
          name: 'match name',
          historyUrl: 'https://osu.ppy.sh/mp/123456',
        },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_identity:#channel',
        { name: 'match name', historyUrl: 'https://osu.ppy.sh/mp/123456' },
      );
    });

    it('should also emit multiplayer_channel_information_player_count event if sender is BanchoBot and received message containing player count', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Players: 6',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_player_count',
        { channel: '#channel', playerCount: 6 },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_player_count:#channel',
        { playerCount: 6 },
      );
    });

    it('should also emit multiplayer_channel_information_slot event if sender is BanchoBot and received message containing slot information', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Slot 5 Not Ready https://osu.ppy.sh/u/123456 player1 [Host, Hidden]',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_slot',
        {
          channel: '#channel',
          gameUserId: 123_456,
          isHost: true,
          isReady: false,
          slotNumber: 5,
          user: 'player1',
          modifications: ['Hidden'],
        },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_information_slot:#channel',
        {
          gameUserId: 123_456,
          isHost: true,
          isReady: false,
          slotNumber: 5,
          user: 'player1',
          modifications: ['Hidden'],
        },
      );
    });

    it('should also emit multiplayer_channel_name_updated event if sender is BanchoBot and received message containing updated match name', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Room name updated to "New match name"',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_name_updated',
        { channel: '#channel', name: 'New match name' },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_channel_name_updated:#channel',
        { name: 'New match name' },
      );
    });

    it('should also emit multiplayer_player_joined_slot event if sender is BanchoBot and received message containing player joined slot', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'player1 joined in slot 1.',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_player_joined_slot',
        { channel: '#channel', user: 'player1', slotNumber: 1 },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_player_joined_slot:#channel',
        { user: 'player1', slotNumber: 1 },
      );
    });

    it('should also emit multiplayer_player_left_room event if sender is BanchoBot and received message containing player left room', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'player1 left the game.',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_player_left_room',
        { channel: '#channel', user: 'player1' },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_player_left_room:#channel',
        { user: 'player1' },
      );
    });

    it('should also emit multiplayer_player_moved_slot event if sender is BanchoBot and received message containing player moved slot', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'player1 moved to slot 3',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_player_moved_slot',
        { channel: '#channel', user: 'player1', slotNumber: 3 },
      );
      expect(eventEmitter).toHaveBeenCalledWith(
        'multiplayer_player_moved_slot:#channel',
        {
          user: 'player1',
          slotNumber: 3,
        },
      );
    });

    it('should also emit user_already_in_channel event if sender is BanchoBot and received message is indicating that the user is already in the channel', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'User is already in the room',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(3);
      expect(eventEmitter).toHaveBeenCalledWith('user_already_in_channel');
    });

    it('should also emit user_invited_to_channel event if sender is BanchoBot and received message is an multiplayer match invitation', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'Invited username to the room',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(4);
      expect(eventEmitter).toHaveBeenCalledWith('user_invited_to_channel', {
        channel: '#channel',
        user: 'username',
      });
      expect(eventEmitter).toHaveBeenCalledWith(
        'user_invited_to_channel:#channel:username',
      );
    });

    it('should also emit user_not_found event if sender is BanchoBot and received message is a user not found notice', () => {
      const packetParts = [
        'BanchoBot!server@localhost.dev PRIVMSG #channel',
        'User not found',
      ];
      const command = new IrcCommandPrivateMessage(banchoClient, packetParts);
      const eventEmitter = vi.spyOn(banchoClient, 'emit');

      command.handleCommand();

      expect(eventEmitter).toHaveBeenCalledTimes(3);
      expect(eventEmitter).toHaveBeenCalledWith('user_not_found');
    });
  });
});
