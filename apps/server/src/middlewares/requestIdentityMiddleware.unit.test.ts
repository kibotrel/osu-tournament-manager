import { HttpHeader } from '@packages/shared';
import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/expressMocks.js';

import { setRequestId } from './requestIdentityMiddleware.js';

vi.mock('node:crypto', () => {
  return {
    randomUUID: vi.fn().mockReturnValue('test-unique-id'),
  };
});

describe('setRequestId', () => {
  it('should set request.id and X-Request-Id header', () => {
    const request = expressRequestMock() as Request;
    const response = expressResponseMock() as Response;
    const next = expressNextFunctionMock();

    setRequestId(request, response, next);

    expect(request.id).toEqual('test-unique-id');
    expect(response.setHeader).toHaveBeenCalledWith(
      HttpHeader.RequestId,
      'test-unique-id',
    );
  });
});
