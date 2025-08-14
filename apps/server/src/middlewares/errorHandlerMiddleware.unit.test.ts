import {
  type ErrorReport,
  HttpContentType,
  HttpForbiddenError,
  HttpHeader,
  HttpMethod,
  HttpStatusCode,
  HttpStatusMessage,
} from '@packages/shared';
import type { Response } from 'express';
import {
  MethodNotAllowed,
  NotFound,
} from 'express-openapi-validator/dist/openapi.validator.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { logger } from '#src/dependencies/loggerDependency.js';
import { popCacheArrayByKey } from '#src/queries/cache/deleteCacheQueries.js';
import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/expressMocks.js';

import { errorHandler } from './errorHandlerMiddleware.js';

vi.mock('#src/dependencies/loggerDependency.js', () => {
  return {
    logger: {
      error: vi.fn(),
    },
  };
});

vi.mock('#src/configs/environmentConfig.js', () => {
  return {
    environmentConfig: { isProductionMode: true },
  };
});

vi.mock('#src/queries/cache/deleteCacheQueries.js', () => {
  return {
    popCacheArrayByKey: vi.fn(),
  };
});

describe('errorHandler', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return status code 400 if error is instance of Error along with error report', async () => {
    const mockedPopCacheArrayByKey = vi.mocked(popCacheArrayByKey);

    mockedPopCacheArrayByKey.mockResolvedValueOnce([]);

    const error = new Error('test');
    const next = expressNextFunctionMock();
    const request = expressRequestMock<never, ErrorReport>();
    const response = expressResponseMock() as Response;

    request.id = 'test-request-id';
    request.method = 'GET';
    request.url = '/api/v1/test';

    Object.defineProperty(request, 'path', {
      value: request.url,
      writable: false,
    });

    await errorHandler(error, request, response, next);

    expect(response.setHeader).toHaveBeenCalledTimes(2);
    expect(response.setHeader).toHaveBeenCalledWith(
      HttpHeader.ContentType,
      HttpContentType.ApplicationProblemJson,
    );
    expect(logger.error).toHaveBeenCalledWith('test', {
      error,
      errorMetadata: {},
      requestId: request.id,
    });

    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.BadRequest);
    expect(response.json).toHaveBeenCalledWith({
      detail: error.message,
      errors: undefined,
      instance: request.path,
      status: HttpStatusCode.BadRequest,
      title: 'Bad Request',
    });
  });

  it('should return the relative status code if error is instance of HttpError along with error report', async () => {
    const mockedPopCacheArrayByKey = vi.mocked(popCacheArrayByKey);

    mockedPopCacheArrayByKey.mockResolvedValueOnce([]);

    const error = new HttpForbiddenError({ message: 'test' });
    const next = expressNextFunctionMock();
    const request = expressRequestMock<never, ErrorReport>();
    const response = expressResponseMock() as Response;

    request.id = 'test-request-id';
    request.method = 'GET';
    request.url = '/api/v1/test';

    Object.defineProperty(request, 'path', {
      value: request.url,
      writable: false,
    });

    await errorHandler(error, request, response, next);

    expect(response.setHeader).toHaveBeenCalledTimes(2);
    expect(logger.error).toHaveBeenCalledWith('test', {
      error,
      errorMetadata: {},
      requestId: request.id,
    });
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.Forbidden);
    expect(response.json).toHaveBeenCalledWith({
      detail: error.message,
      errors: undefined,
      instance: request.path,
      status: HttpStatusCode.Forbidden,
      title: HttpStatusMessage.Forbidden,
    });
  });

  it('should return status 404 if instance of express-open-api-validator/NotFound and convert it to an usable error report', async () => {
    const mockedPopCacheArrayByKey = vi.mocked(popCacheArrayByKey);

    mockedPopCacheArrayByKey.mockResolvedValueOnce([]);

    const error = new NotFound({ path: '/api/v1/test' });
    const next = expressNextFunctionMock();
    const request = expressRequestMock<never, ErrorReport>();
    const response = expressResponseMock() as Response;

    request.id = 'test-request-id';
    request.method = 'GET';
    request.url = '/api/v1/test';

    Object.defineProperty(request, 'path', {
      value: request.url,
      writable: false,
    });

    await errorHandler(error, request, response, next);

    expect(response.setHeader).toHaveBeenCalledTimes(2);
    expect(logger.error).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.NotFound);
    expect(response.json).toHaveBeenCalledWith({
      detail: undefined,
      errors: undefined,
      instance: request.path,
      status: HttpStatusCode.NotFound,
      title: HttpStatusMessage.NotFound,
    });
  });

  it('should return status 405 if instance of express-open-api-validator/MethodNotAllowed and convert it to an usable error report and add Allow header to response', async () => {
    const mockedPopCacheArrayByKey = vi.mocked(popCacheArrayByKey);

    mockedPopCacheArrayByKey.mockResolvedValueOnce([]);

    const error = new MethodNotAllowed({ path: '/api/v1/public/health' });
    const next = expressNextFunctionMock();
    const request = expressRequestMock<never, ErrorReport>();
    const response = expressResponseMock() as Response;

    request.id = 'test-request-id';
    request.method = 'POST';
    request.url = '/api/v1/public/health';

    Object.defineProperty(request, 'path', {
      value: request.url,
      writable: false,
    });

    await errorHandler(error, request, response, next);

    expect(response.setHeader).toHaveBeenCalledTimes(3);
    expect(response.setHeader).toHaveBeenCalledWith(
      HttpHeader.Allow,
      HttpMethod.Get,
    );
    expect(logger.error).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(
      HttpStatusCode.MethodNotAllowed,
    );
    expect(response.json).toHaveBeenCalledWith({
      detail: undefined,
      errors: undefined,
      instance: request.path,
      status: HttpStatusCode.MethodNotAllowed,
      title: HttpStatusMessage.MethodNotAllowed,
    });
  });

  it('should return status 500 if error is not recognized', async () => {
    const mockedPopCacheArrayByKey = vi.mocked(popCacheArrayByKey);

    mockedPopCacheArrayByKey.mockResolvedValueOnce([]);

    const error = 'test';
    const next = expressNextFunctionMock();
    const request = expressRequestMock<never, ErrorReport>();
    const response = expressResponseMock() as Response;

    request.id = 'test-request-id';
    request.method = 'GET';
    request.url = '/api/v1/test';

    Object.defineProperty(request, 'path', {
      value: request.url,
      writable: false,
    });

    await errorHandler(error, request, response, next);

    expect(response.setHeader).toHaveBeenCalledTimes(2);
    expect(response.status).toHaveBeenCalledWith(
      HttpStatusCode.InternalServerError,
    );
    expect(response.json).toHaveBeenCalledWith({
      errors: undefined,
      instance: request.path,
      status: HttpStatusCode.InternalServerError,
      title: HttpStatusMessage.InternalServerError,
    });
  });
});
