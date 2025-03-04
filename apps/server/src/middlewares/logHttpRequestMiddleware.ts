import type { RequestHandler } from 'express';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { silentHttpEndpoints } from '#src/constants/httpConstants.js';
import { logger } from '#src/dependencies/loggerDependency.js';

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
  const releventInformation = {
    ...(Object.keys(body).length > 0 && { body }),
    ...(Object.keys(params).length > 0 && { params }),
    ...(Object.keys(query).length > 0 && { query }),
  };

  logger.http(`${request.method} ${request.url}`, {
    ...releventInformation,
    requestId: request.id,
  });

  return next();
};
