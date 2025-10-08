import type {
  CreateMatchRequestBody,
  CreateMatchResponseBody,
} from '@packages/shared';
import { HttpStatusCode } from '@packages/shared';
import { matchedData } from 'express-validator';
import { describe, expect, it, vi } from 'vitest';

import { openMatchService } from '#src/services/matches/matchesService.js';
import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/expressMocks.js';

import { createMatchController } from './createMatchController.js';

vi.mock('express-validator', () => {
  return {
    matchedData: vi.fn().mockImplementation((request) => {
      return { ...request.params, ...request.body, ...request.query };
    }),
  };
});

vi.mock('#src/services/matches/matchesService.js', () => {
  return {
    openMatchService: vi.fn(),
  };
});

describe('closeMatchController', () => {
  it('should respond with status 200 and closure reason', async () => {
    const openMatchServiceMock = vi.mocked(openMatchService);
    const next = expressNextFunctionMock();
    const request = expressRequestMock<
      never,
      CreateMatchResponseBody,
      CreateMatchRequestBody
    >();
    const response = expressResponseMock<CreateMatchResponseBody>();
    const now = new Date();

    request.body = { name: 'Test Match' };
    openMatchServiceMock.mockResolvedValueOnce({
      bansPerTeam: 0,
      bestOf: 0,
      createdAt: now,
      endsAt: null,
      gameMatchId: 1,
      id: 1,
      isQualifierMatch: false,
      mappoolId: 0,
      name: request.body.name,
      protectsPerTeam: 0,
      startsAt: now,
      tournamentId: 0,
      updatedAt: now,
      winnerTournamentTeamId: null,
    });

    await createMatchController(request, response, next);

    expect(matchedData).toHaveBeenCalledWith(request);
    expect(openMatchServiceMock).toHaveBeenCalledWith(request.body.name);
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.Created);
    expect(response.json).toHaveBeenCalledWith({
      gameMatchId: 1,
      name: request.body.name,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error if openMatchService fails', async () => {
    const openMatchServiceMock = vi.mocked(openMatchService);
    const next = expressNextFunctionMock();
    const request = expressRequestMock<
      never,
      CreateMatchResponseBody,
      CreateMatchRequestBody
    >();

    request.body = { name: 'Test Match' };

    const error = new Error('Test error');

    openMatchServiceMock.mockRejectedValueOnce(error);

    const response = expressResponseMock<CreateMatchResponseBody>();

    await createMatchController(request, response, next);

    expect(matchedData).toHaveBeenCalledWith(request);
    expect(openMatchServiceMock).toHaveBeenCalledWith(request.body.name);
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
