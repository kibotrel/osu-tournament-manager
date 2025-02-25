import type { BanchoClient } from '#src/banchoClientExport.js';
import { IrcCommandFactory } from '#src/classes/ircCommandFactoryClass.js';
import { IrcCommandPing } from '#src/classes/ircCommandPingClass.js';
import { IrcKeyword, ignoredIrcKeywords } from '#src/constants/ircConstants.js';

export const parseIrcMessage = (banchoClient: BanchoClient, packet: string) => {
  if (packet === `${IrcKeyword.Ping} ${banchoClient.serverInformation.host}`) {
    return new IrcCommandPing(banchoClient);
  }

  const parts = packet.split(':').filter(Boolean);
  const [, command] = parts.at(0)?.split(' ') ?? [];
  const commandName = command as IrcKeyword;

  if (!commandName || ignoredIrcKeywords.has(commandName)) {
    return;
  }

  const ircCommandFactory = new IrcCommandFactory(banchoClient);

  return ircCommandFactory.createCommandHandler(commandName, parts);
};
