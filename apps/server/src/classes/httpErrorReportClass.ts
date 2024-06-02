import type { HttpError } from '@packages/shared';
import {
  HttpStatusCodes,
  HttpStatusCodesToMessagesMapping,
} from '@packages/shared';
import type { Request } from 'express';

import { AllowedHttpMethodsOnRessource } from '#src/constants/apiConstants.js';

/**
 * {@link https://datatracker.ietf.org/doc/rfc9457/ | RFC 9457} compliant error
 * report sent to the client when `Content-Type` is `application/problem+json`.
 */
export class HttpErrorReport {
  /** Endpoint where the error occurred. */
  public readonly instance: string;
  /** HTTP status code. */
  public readonly status: HttpStatusCodes;
  /** HTTP status message. */
  public readonly title: string;
  /**
   * Additional validation errors, related to `express-openapi-validator`.
   * This isn't not included in {@link https://datatracker.ietf.org/doc/rfc9457/ | RFC 9457}.
   */
  public readonly errors?: Array<Record<string, string>> | undefined;
  /** Additional details about the error. */
  public readonly detail?: string | undefined;

  constructor(request: Request, error: HttpError) {
    this.instance = request.path;
    this.status = error.status ?? HttpStatusCodes.BadRequest;
    this.title = HttpStatusCodesToMessagesMapping[this.status];

    if (
      ![
        HttpStatusCodes.InternalServerError,
        HttpStatusCodes.NotFound,
        HttpStatusCodes.MethodNotAllowed,
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

    return AllowedHttpMethodsOnRessource[endpoint];
  }
}
