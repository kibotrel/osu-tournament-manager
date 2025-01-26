/**
 * Normalize path by collapsing successive slashes into a single slash.
 */
export const normalizePath = (path: string): string => {
  return path.replaceAll(/\/+/g, '/');
};
