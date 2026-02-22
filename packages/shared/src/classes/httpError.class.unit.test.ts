import { describe, expect, it } from 'vitest';

import {
  HttpBadRequestError,
  HttpForbiddenError,
  HttpInternalServerError,
  HttpLockedError,
  HttpMethodNotAllowedError,
  HttpNotFoundError,
  HttpRangeNotSatisfiableError,
  HttpServiceUnavailableError,
  HttpTooManyRequestsError,
  HttpUnauthorizedError,
  HttpUnavailableForLegalReasonsError,
  HttpUnprocessableContentError,
} from '#src/classes/httpError.class.js';

describe('HttpBadRequestError', () => {
  it('should instantiate with the status 400', () => {
    const error = new HttpBadRequestError({ message: '' });

    expect(error.status).toBe(400);
  });
});

describe('HttpForbiddenError', () => {
  it('should instantiate with the status 403', () => {
    const error = new HttpForbiddenError({ message: '' });

    expect(error.status).toBe(403);
  });
});

describe('HttpInternalServerError', () => {
  it('should instantiate with the status 500', () => {
    const error = new HttpInternalServerError({ message: '' });

    expect(error.status).toBe(500);
  });
});

describe('HttpLockedError', () => {
  it('should instantiate with the status 423', () => {
    const error = new HttpLockedError({ message: '' });

    expect(error.status).toBe(423);
  });
});

describe('HttpMethodNotAllowedError', () => {
  it('should instantiate with the status 405', () => {
    const error = new HttpMethodNotAllowedError({ message: '' });

    expect(error.status).toBe(405);
  });
});

describe('HttpNotFoundError', () => {
  it('should instantiate with the status 404', () => {
    const error = new HttpNotFoundError({ message: '' });

    expect(error.status).toBe(404);
  });
});

describe('HttpRangeNotSatisfiableError', () => {
  it('should instantiate with the status 416', () => {
    const error = new HttpRangeNotSatisfiableError({ message: '' });

    expect(error.status).toBe(416);
  });
});

describe('HttpServiceUnavailableError', () => {
  it('should instantiate with the status 503', () => {
    const error = new HttpServiceUnavailableError({ message: '' });

    expect(error.status).toBe(503);
  });
});

describe('HttpTooManyRequestsError', () => {
  it('should instantiate with the status 429', () => {
    const error = new HttpTooManyRequestsError({ message: '' });

    expect(error.status).toBe(429);
  });
});

describe('HttpUnauthorizedError', () => {
  it('should instantiate with the status 401', () => {
    const error = new HttpUnauthorizedError({ message: '' });

    expect(error.status).toBe(401);
  });
});

describe('HttpUnavailableForLegalReasonsError', () => {
  it('should instantiate with the status 451', () => {
    const error = new HttpUnavailableForLegalReasonsError({ message: '' });

    expect(error.status).toBe(451);
  });
});

describe('HttpUnprocessableContentError', () => {
  it('should instantiate with the status 422', () => {
    const error = new HttpUnprocessableContentError({ message: '' });

    expect(error.status).toBe(422);
  });
});
