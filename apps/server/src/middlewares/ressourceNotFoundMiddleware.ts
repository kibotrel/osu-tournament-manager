import type { RequestHandler } from 'express';

import { HttpNotFoundError } from '#src/classes/httpErrorClass.js';
import { HttpErrorReport } from '#src/classes/httpErrorReportClass.js';
import { HttpContentTypes, HttpHeaders } from '#src/constants/httpConstants.js';

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
