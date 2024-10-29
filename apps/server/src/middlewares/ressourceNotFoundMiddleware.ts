import {
  HttpContentType,
  HttpErrorReport,
  HttpHeader,
  HttpNotFoundError,
} from '@packages/shared';
import type { RequestHandler } from 'express';

export const ressourceNotFoundHandler: RequestHandler = (request, response) => {
  const error = new HttpNotFoundError({
    message: `Ressource at ${request.url} could not be found`,
  });
  const errorReport = new HttpErrorReport({ request, error });

  response.setHeader(
    HttpHeader.ContentType,
    HttpContentType.ApplicationProblemJson,
  );

  return response.status(errorReport.status).json(errorReport.serialize());
};
