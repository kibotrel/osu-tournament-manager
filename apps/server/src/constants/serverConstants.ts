export const allowedHttpMethodsOnRessource: Record<
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
export const silentEndpoints = new Set([
  '/api/v1/public/health',
  '/api/v1/public/login',
  '/api/v1/public/logout',
]);
