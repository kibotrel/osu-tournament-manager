/**
 * This list contains all the accessible endpoints on this server and
 * the HTTP methods that are allowed on them. It is used to populate
 * [HTTP Header Allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow)
 * through the [resourceNotFoundHandler](../middlewares/resourceNotFound.middleware.ts) or
 * [errorHandler](../middlewares/errorHandler.middleware.ts) middlewares depending
 * on the context.
 */
export const allowedHttpMethodsOnResource: Record<
  string,
  Array<'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'>
> = {
  '/api/v1/authentication/login': ['POST'],
  '/api/v1/authentication/logout': ['GET'],
  '/api/v1/matches': ['POST'],
  '/api/v1/matches/x': ['GET'],
  '/api/v1/matches/x/chat-history': ['GET'],
  '/api/v1/matches/x/close': ['POST'],
  '/api/v1/matches/x/state': ['GET'],
  '/api/v1/public/health': ['GET'],
};

/**
 * This list contains all the endpoints that should not be logged.
 * Reason can be that they are too noisy or contain sensitive information.
 */
export const silentHttpEndpoints = new Set([
  '/api/v1/authentication/login',
  '/api/v1/authentication/logout',
  '/api/v1/public/health',
]);

export enum HttpEvent {
  Connection = 'connection',
  Upgrade = 'upgrade',
}
