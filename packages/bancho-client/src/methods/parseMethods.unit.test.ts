import { describe, expect, it } from 'vitest';

import { BanchoClient } from '#src/banchoClientExport.js';
import { IrcCommandChannelNotFound } from '#src/classes/ircCommandChannelNotFoundClass.js';
import { IrcCommandChannelTopic } from '#src/classes/ircCommandChannelTopicClass.js';
import { IrcCommandJoin } from '#src/classes/ircCommandJoinClass.js';
import { IrcCommandNameListBody } from '#src/classes/ircCommandNameListBodyClass.js';
import { IrcCommandNoop } from '#src/classes/ircCommandNoopClass.js';
import { IrcCommandPart } from '#src/classes/ircCommandPartClass.js';
import { IrcCommandPing } from '#src/classes/ircCommandPingClass.js';
import { IrcCommandPrivateMessage } from '#src/classes/ircCommandPrivateMessageClass.js';
import { IrcCommandQuit } from '#src/classes/ircCommandQuitClass.js';
import { IrcCommandRecipientNotFound } from '#src/classes/ircCommandRecipientNotFoundClass.js';
import { IrcCommandWelcome } from '#src/classes/ircCommandWelcomeClass.js';
import {
  parseIrcMessage,
  parseIrcUsername,
  parseOsuUsername,
} from '#src/methods/parseMethods.js';

describe('parseIrcMessage', () => {
  const banchoClient = new BanchoClient({
    clientCredentials: { username: 'username', password: 'password' },
    serverInformation: { host: 'localhost.dev', port: 6667 },
  });

  it('should return an instance of IrcCommandPing for ping messages type message', () => {
    expect(parseIrcMessage(banchoClient, 'PING localhost.dev')).toBeInstanceOf(
      IrcCommandPing,
    );
  });

  it('should return undefined if no command is provided type message', () => {
    expect(
      parseIrcMessage(banchoClient, ':test!server@localhost.dev'),
    ).toBeUndefined();
  });

  it('should return undefined if the command is ChannelTopicUpdatedAt type message', () => {
    expect(
      parseIrcMessage(
        banchoClient,
        ':localhost.dev 333 #channel test!server@localhost.dev 0',
      ),
    ).toBeUndefined();
  });

  it('should return undefined if the command is EndOfNameList type message', () => {
    expect(
      parseIrcMessage(
        banchoClient,
        ':localhost.dev 366 username #channel :End of /NAMES list.',
      ),
    ).toBeUndefined();
  });

  it('should return undefined if the command is MessageOfTheDayBegin type message', () => {
    expect(
      parseIrcMessage(banchoClient, ':localhost.dev 375 username :-'),
    ).toBeUndefined();
  });

  it('should return undefined if the command is MessageOfTheDayBody type message', () => {
    expect(
      parseIrcMessage(banchoClient, ':localhost.dev 372 username :-'),
    ).toBeUndefined();
  });

  it('should return undefined if the command is MessageOfTheDayEnd type message', () => {
    expect(
      parseIrcMessage(banchoClient, ':localhost.dev 376 username :-'),
    ).toBeUndefined();
  });

  it('should return undefined if the command is Mode type message', () => {
    expect(
      parseIrcMessage(
        banchoClient,
        ':test!server@localhost.dev MODE #channel +v username',
      ),
    ).toBeUndefined();
  });

  it('should return an ircCommandChannelNotFound instance for ChannelNotFound type message', () => {
    expect(
      parseIrcMessage(
        banchoClient,
        ':localhost.dev 403 username #unknown :No such channel #unknown',
      ),
    ).toBeInstanceOf(IrcCommandChannelNotFound);
  });

  it('should return an instance of IrcCommandChannelTopic for ChannelTopic type message', () => {
    expect(
      parseIrcMessage(
        banchoClient,
        ':localhost.dev 332 username #channel :Channel topic',
      ),
    ).toBeInstanceOf(IrcCommandChannelTopic);
  });

  it('should return an instance of IrcCommandJoin for Join type message', () => {
    expect(
      parseIrcMessage(
        banchoClient,
        ':username!server@localhost.dev JOIN :#channel',
      ),
    ).toBeInstanceOf(IrcCommandJoin);
  });

  it('should return an instance of IrcCommandNameListBody for NameListBody type message', () => {
    expect(
      parseIrcMessage(
        banchoClient,
        ':localhost.dev 353 username = #channel :username1 username2 username3',
      ),
    ).toBeInstanceOf(IrcCommandNameListBody);
  });

  it('should return an instance of IrcCommandNoop for unknown type message', () => {
    expect(
      parseIrcMessage(
        banchoClient,
        ':username!server@localhost.dev UNKNOWN_COMMAND :unknown command',
      ),
    ).toBeInstanceOf(IrcCommandNoop);
  });

  it('should return an instance of IrcCommandPart for Part type message', () => {
    expect(
      parseIrcMessage(
        banchoClient,
        ':username!server@localhost.dev PART :#channel',
      ),
    ).toBeInstanceOf(IrcCommandPart);
  });

  it('should return an instance of IrcCommandPrivateMessage for PrivateMessage type message', () => {
    expect(
      parseIrcMessage(
        banchoClient,
        ':username!server@localhost.dev PRIVMSG #channel :message content',
      ),
    ).toBeInstanceOf(IrcCommandPrivateMessage);
  });

  it('should return an instance of IrcCommandQuit for Quit type message', () => {
    expect(
      parseIrcMessage(
        banchoClient,
        ':username!server@localhost.dev QUIT :quit',
      ),
    ).toBeInstanceOf(IrcCommandQuit);
  });

  it('should return an instance of IrcCommandRecipientNotFound for RecipientNotFound type message', () => {
    expect(
      parseIrcMessage(
        banchoClient,
        ':localhost.dev 401 username1 username2 :No such nick',
      ),
    ).toBeInstanceOf(IrcCommandRecipientNotFound);
  });

  it('should return an instance of IrcCommandWelcome for Welcome type message', () => {
    expect(
      parseIrcMessage(banchoClient, ':localhost.dev 001 username :Welcome'),
    ).toBeInstanceOf(IrcCommandWelcome);
  });
});

describe('parseIrcUsername', () => {
  it('should return the input if no special right is set', () => {
    expect(parseIrcUsername('username')).toBe('username');
  });

  it('should remove the operator right character if present', () => {
    expect(parseIrcUsername('@username')).toBe('username');
  });

  it('should remove the voice right character if present', () => {
    expect(parseIrcUsername('+username')).toBe('username');
  });
});

describe('parseOsuUsername', () => {
  it('should return the input if no spaces are present', () => {
    expect(parseOsuUsername('username')).toBe('username');
  });

  it('should replace spaces with underscores', () => {
    expect(parseOsuUsername('user name')).toBe('user_name');
  });

  it('should replace multiple spaces with underscores', () => {
    expect(parseOsuUsername('user   name')).toBe('user___name');
  });
});
