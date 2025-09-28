import { type LogoutResponseBody, HttpStatusCode } from '@packages/shared';
import { describe, expect, it } from 'vitest';

import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/expressMocks.js';

import { logoutController } from './logoutController.js';

describe('logoutController', () => {
  it('should respond with status 204 and destroy session', () => {
    const next = expressNextFunctionMock();
    const request = expressRequestMock<never, LogoutResponseBody>();
    const response = expressResponseMock<LogoutResponseBody>();

    logoutController(request, response, next);

    expect(next).not.toHaveBeenCalled();
    expect(request.session.destroy).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.NoContent);
    expect(response.end).toHaveBeenCalled();
  });
});
