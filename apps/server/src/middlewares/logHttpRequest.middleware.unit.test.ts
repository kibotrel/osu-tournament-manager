import type { Request, Response } from 'express';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { logger } from '#src/dependencies/logger.dependency.js';
import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/express.mocks.js';

import { logHttpRequest } from './logHttpRequest.middleware.js';

vi.mock('#src/dependencies/logger.dependency.js', () => {
  return {
    logger: {
      http: vi.fn(),
    },
  };
});

vi.mock('#src/configs/environment.config.js', () => {
  return {
    environmentConfig: { isProductionMode: true },
  };
});

describe('logHttpRequest', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should log the request and call next', () => {
    const request = expressRequestMock() as Request;
    const response = expressResponseMock() as Response;
    const next = expressNextFunctionMock();

    request.id = 'test-request-id';
    request.method = 'GET';
    request.url = '/api/v1/test';

    logHttpRequest(request, response, next);

    expect(logger.http).toHaveBeenCalledWith('GET /api/v1/test', {
      requestId: 'test-request-id',
    });
    expect(next).toHaveBeenCalled();
  });

  it('should log body, params, and query if they exist', () => {
    const request = expressRequestMock() as Request;
    const response = expressResponseMock() as Response;
    const next = expressNextFunctionMock();

    request.id = 'test-request-id';
    request.method = 'POST';
    request.url = '/api/v1/test';
    request.body = { key: 'value' };
    request.params = { id: '123' };
    request.query = { search: 'term' };

    logHttpRequest(request, response, next);

    expect(logger.http).toHaveBeenCalledWith('POST /api/v1/test', {
      body: request.body,
      params: request.params,
      query: request.query,
      requestId: 'test-request-id',
    });
    expect(next).toHaveBeenCalled();
  });

  it('should not log health check requests', () => {
    const request = expressRequestMock() as Request;
    const response = expressResponseMock() as Response;
    const next = expressNextFunctionMock();

    request.url = '/api/v1/public/health';

    logHttpRequest(request, response, next);

    expect(logger.http).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should not log request if route is /api/v1/authentication/login', () => {
    const request = expressRequestMock() as Request;
    const response = expressResponseMock() as Response;
    const next = expressNextFunctionMock();

    request.url = '/api/v1/authentication/login';
    request.method = 'POST';

    logHttpRequest(request, response, next);

    expect(logger.http).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should not log request if route is /api/v1/authentication/logout', () => {
    const request = expressRequestMock() as Request;
    const response = expressResponseMock() as Response;
    const next = expressNextFunctionMock();

    request.url = '/api/v1/authentication/logout';
    request.method = 'GET';

    logHttpRequest(request, response, next);

    expect(logger.http).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
