import type { OsuGetMeResponseBody } from '@packages/osu-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createUser } from '#src/queries/users/createUserQueries.js';
import { getUserByGameUserId } from '#src/queries/users/getUserQueries.js';
import type { SelectUser } from '#src/schemas/users/usersTable.js';

import { getOrCreateUser } from './getOrCreateUserService.js';

vi.mock('#src/queries/users/getUserQueries.js', () => {
  return {
    getUserByGameUserId: vi.fn(),
  };
});

vi.mock('#src/queries/users/createUserQueries.js', () => {
  return {
    createUser: vi.fn(),
  };
});

describe('getOrCreateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return existing user if found', async () => {
    const mockedGetUserByGameUserId = vi.mocked(getUserByGameUserId);
    const gameUser: OsuGetMeResponseBody = {
      id: 1,
      avatarUrl: 'http://example.com/test.png',
      country: '__',
      name: 'test',
    };
    const existingUser: SelectUser = {
      avatarUrl: gameUser.avatarUrl,
      country: gameUser.country,
      createdAt: new Date(),
      gameUserId: 1,
      id: 1,
      name: gameUser.name,
      updatedAt: new Date(),
    };

    mockedGetUserByGameUserId.mockResolvedValueOnce(existingUser);

    const result = await getOrCreateUser(gameUser);

    expect(getUserByGameUserId).toHaveBeenCalledWith(gameUser.id);
    expect(createUser).not.toHaveBeenCalled();

    expect(result).toEqual({ isNew: false, user: existingUser });
  });

  it('should create a new user if not found', async () => {
    const mockedGetUserByGameUserId = vi.mocked(getUserByGameUserId);
    const mockedCreateUser = vi.mocked(createUser);
    const gameUser: OsuGetMeResponseBody = {
      id: 2,
      avatarUrl: 'http://example.com/test2.png',
      country: 'US',
      name: 'test2',
    };
    const newUser: SelectUser = {
      avatarUrl: gameUser.avatarUrl,
      country: gameUser.country,
      createdAt: new Date(),
      gameUserId: gameUser.id,
      id: 2,
      name: gameUser.name,
      updatedAt: new Date(),
    };

    mockedGetUserByGameUserId.mockResolvedValueOnce(null);
    mockedCreateUser.mockResolvedValueOnce(newUser);

    const result = await getOrCreateUser(gameUser);

    expect(getUserByGameUserId).toHaveBeenCalledWith(gameUser.id);
    expect(createUser).toHaveBeenCalledWith({
      avatarUrl: gameUser.avatarUrl,
      country: gameUser.country,
      gameUserId: gameUser.id,
      name: gameUser.name,
    });

    expect(result).toEqual({ isNew: true, user: newUser });
  });
});
