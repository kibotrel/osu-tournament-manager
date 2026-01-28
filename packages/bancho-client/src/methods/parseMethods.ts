import type { BanchoClient } from '#src/banchoClientExport.js';
import { IrcCommandFactory } from '#src/classes/ircCommandFactoryClass.js';
import { IrcCommandPing } from '#src/classes/ircCommandPingClass.js';
import { IrcKeyword, ignoredIrcKeywords } from '#src/constants/ircConstants.js';

/**
 * Parses the IRC message and returns the corresponding command handler.
 */
export const parseIrcMessage = (
  banchoClient: BanchoClient,
  message: string,
) => {
  if (message === `${IrcKeyword.Ping} ${banchoClient.serverInformation.host}`) {
    return new IrcCommandPing(banchoClient);
  }

  const messageStartIndex = message.indexOf(' :');
  const parts: string[] = [];

  if (messageStartIndex === -1) {
    parts.push(message.replace(/^:/, ''));
  } else {
    const metadata = message.slice(0, messageStartIndex + 1).replace(/^:/, '');
    const messageContent = message.slice(messageStartIndex + 2);

    parts.push(metadata, messageContent);
  }

  const [, command] = parts.at(0)?.split(' ') ?? [];
  const commandName = command as IrcKeyword;

  if (!commandName || ignoredIrcKeywords.has(commandName)) {
    return;
  }

  const ircCommandFactory = new IrcCommandFactory(banchoClient);

  return ircCommandFactory.createCommandHandler(commandName, parts);
};

/**
 * Removes the prefix from the username. As stated in [RFC 1459](https://datatracker.ietf.org/doc/html/rfc1459#section-6.2)
 * Command response `RPL_NAMREPLY`, `'@'` is used to denote channel operator
 * and `'+'` is used to denote channel voice status.
 */
export const parseIrcUsername = (username: string) => {
  return username.replace(/^(\+|@)/, '');
};

/**
 * Bancho replaces spaces with underscores in usernames. See [osu! Internet Relay Chat wiki](https://osu.ppy.sh/wiki/en/Community/Internet_Relay_Chat)
 * for more information.
 */
export const parseOsuUsername = (username: string) => {
  return username.replaceAll(' ', '_');
};
