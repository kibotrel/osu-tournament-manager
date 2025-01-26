import { HttpStatusCode } from '#src/constants/httpConstants.js';

export interface HttpErrorOptions {
  cause?: Error | undefined;
  errors?: Array<Record<string, string>> | undefined;
  message: string;
  metadata?: Record<string, unknown> | undefined;
  status: HttpStatusCode;
}

export class HttpError extends Error {
  public override readonly cause?: Error | undefined;
  public readonly errors?: Array<Record<string, string>> | undefined;
  public override readonly message: string;
  public readonly metadata: Record<string, unknown> | undefined;
  public readonly status: HttpStatusCode;

  constructor(options: HttpErrorOptions) {
    const { cause, errors, message, metadata, status } = options;

    super(message);

    this.cause = cause;
    this.errors = errors;
    this.message = message;
    this.metadata = metadata;
    this.name = this.constructor.name;
    this.status = status;
  }
}

export class HttpBadRequestError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message, metadata } = options;

    super({
      cause,
      errors,
      message,
      metadata,
      status: HttpStatusCode.BadRequest,
    });

    this.name = this.constructor.name;
  }
}

export class HttpForbiddenError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message, metadata } = options;

    super({
      cause,
      errors,
      message,
      metadata,
      status: HttpStatusCode.Forbidden,
    });

    this.name = this.constructor.name;
  }
}

export class HttpInternalServerError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message, metadata } = options;

    super({
      cause,
      errors,
      message,
      metadata,
      status: HttpStatusCode.InternalServerError,
    });

    this.name = this.constructor.name;
  }
}

export class HttpLockedError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message, metadata } = options;

    super({
      cause,
      errors,
      message,
      metadata,
      status: HttpStatusCode.Locked,
    });

    this.name = this.constructor.name;
  }
}

export class HttpMethodNotAllowedError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message, metadata } = options;

    super({
      cause,
      errors,
      message,
      metadata,
      status: HttpStatusCode.MethodNotAllowed,
    });

    this.name = this.constructor.name;
  }
}

export class HttpNotFoundError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message, metadata } = options;

    super({
      cause,
      errors,
      message,
      metadata,
      status: HttpStatusCode.NotFound,
    });

    this.name = this.constructor.name;
  }
}

export class HttpRangeNotSatisfiableError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message, metadata } = options;

    super({
      cause,
      errors,
      message,
      metadata,
      status: HttpStatusCode.RangeNotSatisfiable,
    });

    this.name = this.constructor.name;
  }
}

export class HttpServiceUnavailableError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message, metadata } = options;

    super({
      cause,
      errors,
      message,
      metadata,
      status: HttpStatusCode.ServiceUnavailable,
    });

    this.name = this.constructor.name;
  }
}

export class HttpTooManyRequestsError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message, metadata } = options;

    super({
      cause,
      errors,
      message,
      metadata,
      status: HttpStatusCode.TooManyRequests,
    });

    this.name = this.constructor.name;
  }
}

export class HttpUnauthorizedError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message, metadata } = options;

    super({
      cause,
      errors,
      message,
      metadata,
      status: HttpStatusCode.Unauthorized,
    });

    this.name = this.constructor.name;
  }
}

export class HttpUnavailableForLegalReasonsError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message, metadata } = options;

    super({
      cause,
      errors,
      message,
      metadata,
      status: HttpStatusCode.UnavailableForLegalReasons,
    });

    this.name = this.constructor.name;
  }
}

export class HttpUnprocessableContentError extends HttpError {
  constructor(options: Omit<HttpErrorOptions, 'status'>) {
    const { cause, errors, message, metadata } = options;

    super({
      cause,
      errors,
      message,
      metadata,
      status: HttpStatusCode.UnprocessableContent,
    });

    this.name = this.constructor.name;
  }
}
