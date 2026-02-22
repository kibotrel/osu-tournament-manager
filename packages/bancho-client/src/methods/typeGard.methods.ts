import type { Socket } from 'node:net';

import type { IrcClientState } from '#src/constants/irc.constants.js';
import { clientStatesAllowingMessage } from '#src/constants/irc.constants.js';

export const isDirectMessageChannel = (recipient: string) => {
  return !isPublicChannel(recipient);
};

export const isPublicChannel = (recipient: string) => {
  return recipient.startsWith('#');
};

export const isSocketReady = (
  state: IrcClientState,
  socket?: Socket,
): socket is Socket => {
  return socket?.writable === true && clientStatesAllowingMessage.has(state);
};
