import type { Request } from 'express';

import type { HttpError } from '#src/classes/httpErrorClass.js';
import {
  HttpStatusCode,
  HttpStatusCodesToMessagesMapping,
} from '#src/constants/httpConstants.js';

export type ErrorReport = Omit<
  HttpErrorReport,
  'allowedHttpMethodsOnRessource' | 'getAllowedMethods' | 'serialize'
>;

export interface HttpErrorReportOptions {
  request: Request;
  allowedHttpMethodsOnRessource?: Record<
    string,
    Array<'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'>
  >;
  error: HttpError;
}

/**
 * {@link https://datatracker.ietf.org/doc/rfc9457/ | RFC 9457} compliant error
 * report sent to the client when `Content-Type` is `application/problem+json`.
 */
export class HttpErrorReport {
  private readonly allowedHttpMethodsOnRessource:
    | Record<string, Array<'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'>>
    | Record<string, never>;
  /** Endpoint where the error occurred. */
  public readonly instance: string;
  public readonly status: HttpStatusCode;
  /** HTTP status message. */
  public readonly title: string;
  /**
   * Additional validation errors, related to `express-openapi-validator`.
   * This isn't not included in {@link https://datatracker.ietf.org/doc/rfc9457/ | RFC 9457}.
   */
  public readonly errors?: Array<Record<string, string>> | undefined;
  public readonly detail?: string | undefined;

  constructor(options: HttpErrorReportOptions) {
    const { request, allowedHttpMethodsOnRessource, error } = options;

    this.allowedHttpMethodsOnRessource = allowedHttpMethodsOnRessource ?? {};
    this.instance = request.path;
    this.status = error.status ?? HttpStatusCode.BadRequest;
    this.title = HttpStatusCodesToMessagesMapping[this.status];

    if (
      ![
        HttpStatusCode.InternalServerError,
        HttpStatusCode.NotFound,
        HttpStatusCode.MethodNotAllowed,
      ].includes(this.status)
    ) {
      this.errors = error.errors;
      this.detail = error.message;
    }
  }

  /**
   * Returns the allowed HTTP methods on the related resource.
   * See {@link https://httpwg.org/specs/rfc9110.html#field.allow | RFC 9110 HTTP `Allow` header}.
   */
  public getAllowedMethods() {
    const endpoint = this.instance.replaceAll(/(?<=\/)\d+/g, 'x');

    return (this.allowedHttpMethodsOnRessource[endpoint] ?? []).join(', ');
  }

  public serialize() {
    return {
      detail: this.detail,
      errors: this.errors,
      instance: this.instance,
      status: this.status,
      title: this.title,
    };
  }
}
