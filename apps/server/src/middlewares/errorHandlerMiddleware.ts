/* eslint-disable @typescript-eslint/no-unused-vars */

import type { HttpError } from '@packages/shared';
import {
  HttpContentTypes,
  HttpHeaders,
  HttpInternalServerError,
  HttpStatusCodes,
  HttpStatusMessages,
} from '@packages/shared';
import type { ErrorRequestHandler } from 'express';

import { HttpErrorReport } from '#src/classes/httpErrorReportClass.js';

/**
 * Type guard to check if the input looks like an `HttpError` for further
 * processing.
 */
export const isHttpError = (input: unknown): input is HttpError => {
  return input instanceof Error && 'status' in input;
};

/*
 * This middleware is used as a catch-all errors on the server-side. This will
 * be the last middleware to be called in the chain. Due to poor design choices
 * from the original `express` authors, the `next` parameter is required even
 * though it is not used. When using TypeScript, this will cause an error and so
 * we need to disable some rules.
 *
 * See https://github.com/expressjs/express/issues/5095 for more information.
 */

/**
 * Middleware to communicate errors to the client in a consistent way conforming
 * to {@link https://datatracker.ietf.org/doc/rfc9457/ | RFC 9457}.
 */
export const errorHandler: ErrorRequestHandler = (
  rawError,
  request,
  response,
  // @ts-expect-error check comment above.
  next,
) => {
  response.setHeader(
    HttpHeaders.ContentType,
    HttpContentTypes.ApplicationProblemJson,
  );

  const error = isHttpError(rawError)
    ? rawError
    : new HttpInternalServerError({
        cause: rawError,
        message: HttpStatusMessages.InternalServerError,
      });
  const errorReport = new HttpErrorReport(request, error);

  if (errorReport.status === HttpStatusCodes.MethodNotAllowed) {
    response.setHeader(HttpHeaders.Allow, errorReport.getAllowedMethods());
  }

  return response.status(errorReport.status).json(errorReport);
};
