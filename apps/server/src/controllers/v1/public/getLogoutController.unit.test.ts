import {
  type GetPublicLogoutResponseBody,
  HttpStatusCode,
} from '@packages/shared';
import { describe, expect, it } from 'vitest';

import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/expressMocks.js';

import { getLogoutController } from './getLogoutController.js';

describe('getLogoutController', () => {
  it('should respond with status 204 and destroy session', () => {
    const next = expressNextFunctionMock();
    const request = expressRequestMock<never, GetPublicLogoutResponseBody>();
    const response = expressResponseMock<GetPublicLogoutResponseBody>();

    getLogoutController(request, response, next);

    expect(next).not.toHaveBeenCalled();
    expect(request.session.destroy).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.NoContent);
    expect(response.end).toHaveBeenCalled();
  });
});
