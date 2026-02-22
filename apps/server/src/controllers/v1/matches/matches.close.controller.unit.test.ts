import type {
  CloseMatchRequestParameters,
  CloseMatchResponseBody,
} from '@packages/shared';
import { HttpStatusCode } from '@packages/shared';
import { matchedData } from 'express-validator';
import { describe, expect, it, vi } from 'vitest';

import { closeMatchService } from '#src/services/matches/matches.service.js';
import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/express.mocks.js';

import { closeMatchController } from './matches.close.controller.js';

vi.mock('express-validator', () => {
  return {
    matchedData: vi.fn().mockImplementation((request) => {
      return { ...request.params, ...request.body, ...request.query };
    }),
  };
});

vi.mock('#src/services/matches/matches.service.js', () => {
  return {
    closeMatchService: vi.fn(),
  };
});

describe('closeMatchController', () => {
  it('should respond with status 200 and closure reason', async () => {
    const closeMatchServiceMock = vi.mocked(closeMatchService);
    const next = expressNextFunctionMock();
    const request = expressRequestMock<
      CloseMatchRequestParameters,
      CloseMatchResponseBody
    >();

    request.params = { gameMatchId: '1' };
    // TODO: Replace this by an enum when match closing states are implemented.
    closeMatchServiceMock.mockResolvedValueOnce({ status: 'closed' });

    const response = expressResponseMock<CloseMatchResponseBody>();

    await closeMatchController(request, response, next);

    expect(matchedData).toHaveBeenCalledWith(request);
    expect(closeMatchServiceMock).toHaveBeenCalledWith(
      Number(request.params.gameMatchId),
    );
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(response.json).toHaveBeenCalledWith({ status: 'closed' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error if closeMatchService fails', async () => {
    const closeMatchServiceMock = vi.mocked(closeMatchService);
    const next = expressNextFunctionMock();
    const request = expressRequestMock<
      CloseMatchRequestParameters,
      CloseMatchResponseBody
    >();

    request.params = { gameMatchId: '1' };

    const error = new Error('Test error');

    closeMatchServiceMock.mockRejectedValueOnce(error);

    const response = expressResponseMock<CloseMatchResponseBody>();

    await closeMatchController(request, response, next);

    expect(closeMatchServiceMock).toHaveBeenCalledWith(
      Number(request.params.gameMatchId),
    );
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
