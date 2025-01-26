import {
  HttpContentType,
  HttpErrorReport,
  HttpHeader,
  HttpNotFoundError,
} from '@packages/shared';
import type { RequestHandler } from 'express';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { logger } from '#src/dependencies/loggerDependency.js';

export const ressourceNotFoundHandler: RequestHandler = async (
  request,
  response,
) => {
  const error = new HttpNotFoundError({
    message: `Ressource at ${request.url} could not be found`,
  });

  if (!environmentConfig.isProductionMode) {
    await logger.error(error.message, {
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
