import { HttpStatusCode } from '../constants/httpConstants.js';

export interface HttpErrorOptions {
  cause?: Error | undefined;
  errors?: Array<Record<string, string>> | undefined;
  message: string;
  status: HttpStatusCode;
}

export class HttpError extends Error {
  public override readonly cause?: Error | undefined;
  public readonly errors?: Array<Record<string, string>> | undefined;
  public override readonly message: string;
  public readonly status: HttpStatusCode;

  constructor(options: HttpErrorOptions) {
    const { cause, errors, message, status } = options;

    super(message);

    this.cause = cause;
    this.errors = errors;
    this.message = message;
    this.status = status;
  }
}

export class HttpBadRequest extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message } = options;

    super({
      cause,
      errors,
      message,
      status: HttpStatusCode.BadRequest,
    });
  }
}

export class HttpForbidden extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message } = options;

    super({
      cause,
      errors,
      message,
      status: HttpStatusCode.Forbidden,
    });
  }
}

export class HttpInternalServerError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message } = options;

    super({
      cause,
      errors,
      message,
      status: HttpStatusCode.InternalServerError,
    });
  }
}

export class HttpLockedError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message } = options;

    super({
      cause,
      errors,
      message,
      status: HttpStatusCode.Locked,
    });
  }
}

export class HttpNotFoundError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message } = options;

    super({
      cause,
      errors,
      message,
      status: HttpStatusCode.NotFound,
    });
  }
}

export class HttpRangeNotSatisfiableError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message } = options;

    super({
      cause,
      errors,
      message,
      status: HttpStatusCode.RangeNotSatisfiable,
    });
  }
}

export class HttpServiceUnavailableError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message } = options;

    super({
      cause,
      errors,
      message,
      status: HttpStatusCode.ServiceUnavailable,
    });
  }
}

export class HttpTooManyRequestsError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message } = options;

    super({
      cause,
      errors,
      message,
      status: HttpStatusCode.TooManyRequests,
    });
  }
}

export class HttpUnauthorizedError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message } = options;

    super({
      cause,
      errors,
      message,
      status: HttpStatusCode.Unauthorized,
    });
  }
}

export class HttpUnavailableForLegalReasonsError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message } = options;

    super({
      cause,
      errors,
      message,
      status: HttpStatusCode.UnavailableForLegalReasons,
    });
  }
}

export class HttpUnprocessableContentError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message } = options;

    super({
      cause,
      errors,
      message,
      status: HttpStatusCode.UnprocessableContent,
    });
  }
}
