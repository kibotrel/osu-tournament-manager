import type { RequestHandler } from 'express';

import { environmentConfig } from '#src/configs/environment.config.js';
import { silentHttpEndpoints } from '#src/constants/http.constants.js';
import { logger } from '#src/dependencies/logger.dependency.js';

const { isProductionMode } = environmentConfig;

export const logHttpRequest: RequestHandler = (request, _, next) => {
  const isHealthCheck = request.url === '/api/v1/public/health';

  if (
    isHealthCheck ||
    (isProductionMode && silentHttpEndpoints.has(request.url))
  ) {
    return next();
  }

  const { body, params, query } = request;
  const relevantInformation = {
    ...(Object.keys(body ?? {}).length > 0 && { body }),
    ...(Object.keys(params ?? {}).length > 0 && { params }),
    ...(Object.keys(query ?? {}).length > 0 && { query }),
  };

  logger.http(`${request.method} ${request.url}`, {
    ...relevantInformation,
    requestId: request.id,
  });

  return next();
};
