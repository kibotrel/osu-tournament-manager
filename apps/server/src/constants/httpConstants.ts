/**
 * This list contains all the accessible endpoints on this server and
 * the HTTP methods that are allowed on them. It is used to populate
 * [HTTP Header Allow](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Allow)
 * through the [resourceNotFoundHandler](../middlewares/resourceNotFoundMiddleware.ts) or
 * [errorHandler](../middlewares/errorHandlerMiddleware.ts) middlewares depending
 * on the context.
 */
export const allowedHttpMethodsOnResource: Record<
  string,
  Array<'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'>
> = {
  '/api/v1/public/health': ['GET'],
  '/api/v1/public/logout': ['GET'],
  '/api/v1/public/login': ['POST'],
};

/**
 * This list contains all the endpoints that should not be logged.
 * Reason can be that they are too noisy or contain sensitive information.
 */
export const silentHttpEndpoints = new Set([
  '/api/v1/public/health',
  '/api/v1/public/login',
  '/api/v1/public/logout',
]);

export enum HttpEvent {
  Connection = 'connection',
  Upgrade = 'upgrade',
}
