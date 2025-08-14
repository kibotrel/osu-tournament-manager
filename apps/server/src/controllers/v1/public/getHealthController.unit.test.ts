import { HttpStatusCode } from '@packages/shared';
import { describe, expect, it } from 'vitest';

import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/expressMocks.js';

import { getHealthController } from './getHealthController.js';

describe('getHealthController', () => {
  it('should respond with status 204', () => {
    const response = expressResponseMock();
    const next = expressNextFunctionMock();

    getHealthController(expressRequestMock(), response, next);

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.NoContent);
    expect(response.end).toHaveBeenCalled();
  });
});
