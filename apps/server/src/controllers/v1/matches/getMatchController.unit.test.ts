import type {
  GetMatchRequestParameters,
  GetMatchResponseBody,
} from '@packages/shared';
import { HttpStatusCode } from '@packages/shared';
import { matchedData } from 'express-validator';
import { describe, expect, it, vi } from 'vitest';

import { getMatchService } from '#src/services/matches/matchesService.js';
import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/expressMocks.js';

import { getMatchController } from './getMatchController.js';

vi.mock('express-validator', () => {
  return {
    matchedData: vi.fn().mockImplementation((request) => {
      return { ...request.params, ...request.body, ...request.query };
    }),
  };
});

vi.mock('#src/services/matches/matchesService.js', () => {
  return {
    getMatchService: vi.fn(),
  };
});

describe('getMatchController', () => {
  it('should respond with status 200 and match data', async () => {
    const getMatchServiceMock = vi.mocked(getMatchService);
    const next = expressNextFunctionMock();
    const request = expressRequestMock<
      GetMatchRequestParameters,
      GetMatchResponseBody
    >();
    const response = expressResponseMock<GetMatchResponseBody>();
    const match = { endsAt: null, id: 1, name: 'Test Match' };

    request.params = { id: '1' };
    getMatchServiceMock.mockResolvedValueOnce(match);

    await getMatchController(request, response, next);

    expect(matchedData).toHaveBeenCalledWith(request);
    expect(getMatchServiceMock).toHaveBeenCalledWith(Number(request.params.id));
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(response.json).toHaveBeenCalledWith(match);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error if getMatchService fails', async () => {
    const getMatchServiceMock = vi.mocked(getMatchService);
    const next = expressNextFunctionMock();
    const request = expressRequestMock<
      GetMatchRequestParameters,
      GetMatchResponseBody
    >();
    const response = expressResponseMock<GetMatchResponseBody>();
    const error = new Error('Test error');

    request.params = { id: '1' };
    getMatchServiceMock.mockRejectedValueOnce(error);

    await getMatchController(request, response, next);

    expect(matchedData).toHaveBeenCalledWith(request);
    expect(getMatchServiceMock).toHaveBeenCalledWith(Number(request.params.id));
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
