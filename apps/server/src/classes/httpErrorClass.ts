import { HttpStatusCodes } from '#src/constants/httpConstants.js';

export interface HttpErrorOptions {
  cause?: Error | undefined;
  errors?: Array<Record<string, string>> | undefined;
  message: string;
  status: HttpStatusCodes;
}

export class HttpError extends Error {
  public override readonly cause?: Error | undefined;
  public readonly errors?: Array<Record<string, string>> | undefined;
  public override readonly message: string;
  public readonly status: HttpStatusCodes;

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
      status: HttpStatusCodes.BadRequest,
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
      status: HttpStatusCodes.Forbidden,
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
      status: HttpStatusCodes.InternalServerError,
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
      status: HttpStatusCodes.Locked,
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
      status: HttpStatusCodes.NotFound,
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
      status: HttpStatusCodes.RangeNotSatisfiable,
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
      status: HttpStatusCodes.ServiceUnavailable,
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
      status: HttpStatusCodes.TooManyRequests,
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
      status: HttpStatusCodes.Unauthorized,
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
      status: HttpStatusCodes.UnavailableForLegalReasons,
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
      status: HttpStatusCodes.UnprocessableContent,
    });
  }
}
