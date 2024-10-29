/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ErrorReport, HttpError } from '@packages/shared';
import {
  HttpContentType,
  HttpErrorReport,
  HttpHeader,
  HttpInternalServerError,
  HttpMethodNotAllowedError,
  HttpNotFoundError,
  HttpStatusCode,
  HttpStatusMessage,
} from '@packages/shared';
import type { ErrorRequestHandler } from 'express';
import { error } from 'express-openapi-validator';

import { CacheTopic } from '#src/constants/cacheConstants.js';
import { allowedHttpMethodsOnRessource } from '#src/constants/serverConstants.js';
import { popCacheArrayByKey } from '#src/queries/cache/deleteCacheQueries.js';

const { NotFound, MethodNotAllowed } = error;

export const isHttpError = (input: unknown): input is HttpError => {
  return input instanceof Error;
};

export const isExpressOpenApiValidatorMethodNotAllowedError = (
  input: unknown,
) => {
  return input instanceof MethodNotAllowed;
};

export const isExpressOpenApiValidatorNotFoundError = (input: unknown) => {
  return input instanceof NotFound;
};

interface ParseErrorOptions {
  error: unknown;
  method: string;
  url: string;
}

export const normalizeError = (options: ParseErrorOptions) => {
  const { error, method, url } = options;

  if (isExpressOpenApiValidatorMethodNotAllowedError(error)) {
    return new HttpMethodNotAllowedError({
      message: `Method ${method} not allowed on ressource at ${url}`,
    });
  }

  if (isExpressOpenApiValidatorNotFoundError(error)) {
    return new HttpNotFoundError({
      message: `Ressource at ${url} could not be found`,
    });
  }

  if (isHttpError(error)) {
    return error;
  }

  return new HttpInternalServerError({
    cause: error as Error,
    message: HttpStatusMessage.InternalServerError,
  });
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
export const errorHandler: ErrorRequestHandler<never, ErrorReport> = async (
  rawError,
  request,
  response,
  // @ts-expect-error check comment above.
  next,
) => {
  response.setHeader(
    HttpHeader.ContentType,
    HttpContentType.ApplicationProblemJson,
  );

  const error = normalizeError({
    error: rawError,
    method: request.method,
    url: request.url,
  });
  const errorReport = new HttpErrorReport({
    request,
    allowedHttpMethodsOnRessource,
    error,
  });

  if (errorReport.status === HttpStatusCode.MethodNotAllowed) {
    response.setHeader(HttpHeader.Allow, errorReport.getAllowedMethods());
  }

  const metrics = await popCacheArrayByKey(
    `${CacheTopic.ServerMetrics}:${request.id}`,
  );

  response.setHeader(HttpHeader.ServerTiming, metrics.join(', '));

  return response.status(errorReport.status).json(errorReport.serialize());
};
