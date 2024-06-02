import {
  HttpContentTypes,
  HttpHeaders,
  HttpNotFoundError,
} from '@packages/shared';
import type { RequestHandler } from 'express';

import { HttpErrorReport } from '#src/classes/httpErrorReportClass.js';

export const ressourceNotFoundHandler: RequestHandler = (request, response) => {
  const error = new HttpNotFoundError({
    message: `The ressource at ${request.path} could not be found.`,
  });
  const errorReport = new HttpErrorReport(request, error);

  response.setHeader(
    HttpHeaders.ContentType,
    HttpContentTypes.ApplicationProblemJson,
  );

  return response.status(errorReport.status).json(errorReport);
};
