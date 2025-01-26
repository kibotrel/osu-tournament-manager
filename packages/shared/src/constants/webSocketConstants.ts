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

/**
 * [RFC 6455](https://tools.ietf.org/html/rfc6455#section-7.4.1) compliant connection closure codes.
 * Some codes are deliberately omitted as they are not relevant to the current implementation.
 */
export enum WebSocketClosureCode {
  /** The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection. */
  GoingAway = 1001,
  /** Indicates that an endpoint is terminating the connection because it has received a message that is too big. */
  MessageTooLarge = 1009,
  /** Normal closure, the connection successfully completed whatever purpose for which it was created. */
  Normal = 1000,
  /**
   * Indicates an arbitrary set policy violation. Can be used to hide details for security reasons.
   * It's the equivalent of an Internal Server Error in HTTP.
   */
  PolicyViolation = 1008,
  /** Used when receiving unexpected data (e.g text when binary was expected or vice versa). */
  UnsupportedData = 1003,
}

export enum WebSocketClosureReason {
  FinishedCommunicating = 'Finished communicating',
  NotResponding = 'Not responding',
  Reconnecting = 'Reconnecting',
  ServerShutdown = 'Server shutdown',
}

export enum WebSocketEvent {
  Close = 'close',
  Connection = 'connection',
  Error = 'error',
  Message = 'message',
  Open = 'open',
}

export enum WebSocketState {
  Closed = 3,
  Closing = 2,
  Connecting = 0,
  Open = 1,
}
