import {
  HttpContentType,
  HttpErrorReport,
  HttpHeader,
  HttpNotFoundError,
} from '@packages/shared';
import type { RequestHandler } from 'express';

import { environmentConfig } from '#src/configs/environment.config.js';
import { logger } from '#src/dependencies/logger.dependency.js';

export const resourceNotFoundHandler: RequestHandler = (request, response) => {
  const error = new HttpNotFoundError({
    message: `Resource at ${request.url} could not be found`,
  });

  if (!environmentConfig.isProductionMode) {
    logger.error(error.message, {
      requestId: request.id,
      errorMetadata: { ...error.metadata },
      error,
    });
  }

  const errorReport = new HttpErrorReport({ request, error });

  response.setHeader(
    HttpHeader.ContentType,
    HttpContentType.ApplicationProblemJson,
  );

  return response.status(errorReport.status).json(errorReport.serialize());
};
