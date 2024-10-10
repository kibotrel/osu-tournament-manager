import {
  HttpContentType,
  HttpErrorReport,
  HttpHeader,
  HttpNotFoundError,
} from '@packages/shared';
import type { RequestHandler } from 'express';

import { AllowedHttpMethodsOnRessource } from '#src/constants/serverConstants.js';

export const ressourceNotFoundHandler: RequestHandler = (request, response) => {
  const error = new HttpNotFoundError({
    message: `The ressource at ${request.path} could not be found.`,
  });
  const errorReport = new HttpErrorReport(
    request,
    AllowedHttpMethodsOnRessource,
    error,
  );

  response.setHeader(
    HttpHeader.ContentType,
    HttpContentType.ApplicationProblemJson,
  );

  return response.status(errorReport.status).json(errorReport);
};
