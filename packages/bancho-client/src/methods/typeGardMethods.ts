import type { Socket } from 'node:net';

import type { IrcClientState } from '#src/constants/ircConstants.js';
import { clientStatesAllowingMessage } from '#src/constants/ircConstants.js';

export const isSocketReady = (
  socket: unknown,
  state: IrcClientState,
): socket is Socket => {
  return socket !== undefined && clientStatesAllowingMessage.has(state);
};
