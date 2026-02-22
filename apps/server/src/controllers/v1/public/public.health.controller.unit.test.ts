import { HttpStatusCode } from '@packages/shared';
import { describe, expect, it } from 'vitest';

import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/express.mocks.js';

import { healthController } from './public.health.controller.js';

describe('healthController', () => {
  it('should respond with status 204', () => {
    const response = expressResponseMock();
    const next = expressNextFunctionMock();

    healthController(expressRequestMock(), response, next);

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.NoContent);
    expect(response.end).toHaveBeenCalled();
  });
});
