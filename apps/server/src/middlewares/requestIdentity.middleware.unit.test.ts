import { HttpHeader } from '@packages/shared';
import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/express.mocks.js';

import { setRequestIdMiddleware } from './requestIdentity.middleware.js';

vi.mock('node:crypto', () => {
  return {
    randomUUID: vi.fn().mockReturnValue('test-unique-id'),
  };
});

describe('setRequestIdMiddleware', () => {
  it('should set request.id and X-Request-Id header', () => {
    const request = expressRequestMock() as Request;
    const response = expressResponseMock() as Response;
    const next = expressNextFunctionMock();

    setRequestIdMiddleware(request, response, next);

    expect(request.id).toEqual('test-unique-id');
    expect(response.setHeader).toHaveBeenCalledWith(
      HttpHeader.RequestId,
      'test-unique-id',
    );
  });
});
