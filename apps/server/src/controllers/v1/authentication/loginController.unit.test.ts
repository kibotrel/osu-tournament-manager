import type { OsuPostOauthTokenResponseBody } from '@packages/osu-sdk';
import {
  HttpStatusCode,
  type LoginRequestBody,
  type LoginResponseBody,
} from '@packages/shared';
import { matchedData } from 'express-validator';
import { describe, expect, it, vi } from 'vitest';

import type { SelectUser } from '#src/schemas/users/usersTable.js';
import { loginWithOsu } from '#src/services/login/loginWithOsuService.js';
import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/expressMocks.js';

import { loginController } from './loginController.js';

vi.mock('express-validator', () => {
  return {
    matchedData: vi.fn().mockImplementation((request) => {
      return { ...request.params, ...request.body, ...request.query };
    }),
  };
});

vi.mock('#src/services/login/loginWithOsuService.js', () => {
  return {
    loginWithOsu: vi.fn(),
  };
});

describe('loginController', () => {
  it('should respond with status 200 for existing users', async () => {
    const loginWithOsuMock = vi.mocked(loginWithOsu);
    const next = expressNextFunctionMock();
    const request = expressRequestMock<
      never,
      LoginResponseBody,
      LoginRequestBody,
      never
    >();

    request.body = { authenticationCode: 'test-auth-code' };

    const user: SelectUser = {
      avatarUrl: 'https://example.com/avatar.png',
      country: '__',
      createdAt: new Date(),
      gameUserId: 1,
      id: 1,
      name: 'TestUser',
      updatedAt: new Date(),
    } as const;
    const bearer: OsuPostOauthTokenResponseBody = {
      expiryTimestamp: Date.now(),
      refreshToken: 'test-refresh-token',
      token: 'test-access-token',
    } as const;

    loginWithOsuMock.mockResolvedValue({ isNew: false, user, bearer });

    const response = expressResponseMock<LoginResponseBody>();

    await loginController(request, response, next);

    expect(matchedData).toHaveBeenCalledWith(request);
    expect(loginWithOsu).toHaveBeenCalledWith(request.body.authenticationCode);
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(response.json).toHaveBeenCalledWith({
      avatarUrl: user.avatarUrl,
      gameUserId: user.gameUserId,
      name: user.name,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should respond with status 201 for new users', async () => {
    const loginWithOsuMock = vi.mocked(loginWithOsu);
    const next = expressNextFunctionMock();
    const request = expressRequestMock<
      never,
      LoginResponseBody,
      LoginRequestBody,
      never
    >();

    request.body = { authenticationCode: 'test-auth-code' };

    const user: SelectUser = {
      avatarUrl: 'https://example.com/avatar.png',
      country: '__',
      createdAt: new Date(),
      gameUserId: 1,
      id: 1,
      name: 'TestUser',
      updatedAt: new Date(),
    } as const;
    const bearer: OsuPostOauthTokenResponseBody = {
      expiryTimestamp: Date.now(),
      refreshToken: 'test-refresh-token',
      token: 'test-access-token',
    } as const;

    loginWithOsuMock.mockResolvedValue({ isNew: true, user, bearer });

    const response = expressResponseMock<LoginResponseBody>();

    await loginController(request, response, next);

    expect(matchedData).toHaveBeenCalledWith(request);
    expect(loginWithOsu).toHaveBeenCalledWith(request.body.authenticationCode);
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.Created);
    expect(response.json).toHaveBeenCalledWith({
      avatarUrl: user.avatarUrl,
      gameUserId: user.gameUserId,
      name: user.name,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with an error if loginWithOsu fails', async () => {
    const loginWithOsuMock = vi.mocked(loginWithOsu);
    const next = expressNextFunctionMock();
    const request = expressRequestMock<
      never,
      LoginResponseBody,
      LoginRequestBody,
      never
    >();

    request.body = { authenticationCode: 'test-auth-code' };

    const error = new Error('Login failed');

    loginWithOsuMock.mockRejectedValue(error);

    const response = expressResponseMock<LoginResponseBody>();

    await loginController(request, response, next);

    expect(matchedData).toHaveBeenCalledWith(request);
    expect(loginWithOsu).toHaveBeenCalledWith(request.body.authenticationCode);
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
