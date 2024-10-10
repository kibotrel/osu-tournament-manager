export const AllowedHttpMethodsOnRessource: Record<
  string,
  Array<'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'>
> = {
  '/api/v1/public/health': ['GET'],
  '/api/v1/public/logout': ['GET'],
  '/api/v1/public/login': ['POST'],
};
