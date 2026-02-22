import type {
  GetMatchStateRequestParameters,
  GetMatchStateResponseBody,
} from '@packages/shared';
import { HttpStatusCode } from '@packages/shared';
import { matchedData } from 'express-validator';
import { describe, expect, it, vi } from 'vitest';

import { getMatchStateService } from '#src/services/matches/matches.service.js';
import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/express.mocks.js';

import { getMatchStateController } from './matches.getState.controller.js';

vi.mock('express-validator', () => {
  return {
    matchedData: vi.fn().mockImplementation((request) => {
      return { ...request.params, ...request.body, ...request.query };
    }),
  };
});

vi.mock('#src/services/matches/matches.service.js', () => {
  return {
    getMatchStateService: vi.fn(),
  };
});

describe('getMatchStateController', () => {
  it('should respond with status 200 and match state data', async () => {
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);
    const next = expressNextFunctionMock();
    const request = expressRequestMock<
      GetMatchStateRequestParameters,
      GetMatchStateResponseBody
    >();
    const response = expressResponseMock<GetMatchStateResponseBody>();
    const state = {
      globalModifications: [],
      playerCount: 0,
      slots: [],
      activeBeatmap: { name: 'test', url: 'test-url' },
    };

    request.params = { gameMatchId: '1' };
    getMatchStateServiceMock.mockResolvedValueOnce(state);

    await getMatchStateController(request, response, next);

    expect(matchedData).toHaveBeenCalledWith(request);
    expect(getMatchStateServiceMock).toHaveBeenCalledWith(
      request.params.gameMatchId,
    );
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(response.json).toHaveBeenCalledWith({ state });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error if getMatchStateService fails', async () => {
    const getMatchStateServiceMock = vi.mocked(getMatchStateService);
    const next = expressNextFunctionMock();
    const request = expressRequestMock<
      GetMatchStateRequestParameters,
      GetMatchStateResponseBody
    >();
    const response = expressResponseMock<GetMatchStateResponseBody>();
    const error = new Error('Test error');

    request.params = { gameMatchId: '1' };
    getMatchStateServiceMock.mockRejectedValueOnce(error);

    await getMatchStateController(request, response, next);

    expect(matchedData).toHaveBeenCalledWith(request);
    expect(getMatchStateServiceMock).toHaveBeenCalledWith(
      request.params.gameMatchId,
    );
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
