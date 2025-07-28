import { HttpContentType, HttpHeader, HttpStatusCode } from '@packages/shared';
import type { Request, Response } from 'express';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { logger } from '#src/dependencies/loggerDependency.js';
import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/expressMocks.js';

import { ressourceNotFoundHandler } from './ressourceNotFoundMiddleware.js';

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

describe('ressourceNotFoundHandler', () => {
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

    ressourceNotFoundHandler(request, response, next);

    expect(logger.error).not.toHaveBeenCalled();
    expect(response.setHeader).toHaveBeenCalledWith(
      HttpHeader.ContentType,
      HttpContentType.ApplicationProblemJson,
    );
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.NotFound);
    expect(response.json).toHaveBeenCalledWith({
      status: HttpStatusCode.NotFound,
      title: 'Not Found',
    });
  });
});
