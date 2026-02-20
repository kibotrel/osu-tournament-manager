import { HttpUnauthorizedError } from '@packages/shared';
import type { Request, Response } from 'express';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/express.mocks.js';

import { isAuthenticated } from './session.middleware.js';

vi.mock('#src/dependencies/cache.dependency.js', () => {
  return {
    cache: {},
  };
});

vi.mock('express-session', () => {
  return {
    default: () => {
      return vi.fn();
    },
  };
});

describe('isAuthenticated', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should accept request if user is set on request object', () => {
    const request = expressRequestMock() as Request;
    const response = expressResponseMock() as Response;
    const next = expressNextFunctionMock();

    request.session.user = {
      gameApiBearer: { token: '', expiryTimestamp: 0, refreshToken: '' },
      gameUserId: 1,
      id: 1,
    };

    isAuthenticated(request, response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should deny request with an unauthorized error if user is not set on request object', () => {
    const request = expressRequestMock() as Request;
    const response = expressResponseMock() as Response;
    const next = expressNextFunctionMock();

    isAuthenticated(request, response, next);

    expect(next).toHaveBeenCalledWith(
      new HttpUnauthorizedError({
        message: 'You must be authenticated to access this resource',
      }),
    );
  });
});
