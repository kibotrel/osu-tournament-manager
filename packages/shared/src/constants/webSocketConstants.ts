import { Time } from '#src/constants/timeConstants.js';

/**
 * The interval at witch sever should send ping messages to all connected clients.
 * This is used to close dead or inactive connections and improve performance over time.
 */
export const WEBSOCKET_PING_INTERVAL = 30 * Time.Second;

/**
 * [RFC 6455](https://tools.ietf.org/html/rfc6455#section-5.5.2) compliant ping payload.
 */
export const WEBSOCKET_PING_PAYLOAD = 9;

/**
 * The timeout after which server should consider a client dead if it hasn't responded to a ping message.
 */
export const WEBSOCKET_PONG_TIMEOUT = 45 * Time.Second;

/**
 * [RFC 6455](https://tools.ietf.org/html/rfc6455#section-5.5.2) compliant pong payload.
 */
export const WEBSOCKET_PONG_PAYLOAD = 10;
