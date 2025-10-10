import {
  WEBSOCKET_PING_INTERVAL,
  WEBSOCKET_PONG_PAYLOAD,
} from '@packages/shared';

import { WebSocketServer } from '#src/classes/webSocketServerClass.js';

export const webSocketServer = new WebSocketServer({
  pingIntervalTime: WEBSOCKET_PING_INTERVAL,
  pingPayload: WEBSOCKET_PONG_PAYLOAD,
  pongPayload: WEBSOCKET_PONG_PAYLOAD,
});
