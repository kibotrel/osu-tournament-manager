import type { OsuGetMeResponseBody } from '@packages/osu-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createUserQuery } from '#src/queries/users/users.create.queries.js';
import { getUserByGameUserIdQuery } from '#src/queries/users/users.get.queries.js';
import type { SelectUser } from '#src/schemas/users/users.users.table.js';

import { getOrCreateUserService } from './users.getOrCreate.service.js';

vi.mock('#src/queries/users/users.get.queries.js', () => {
  return {
    getUserByGameUserIdQuery: vi.fn(),
  };
});

vi.mock('#src/queries/users/users.create.queries.js', () => {
  return {
    createUserQuery: vi.fn(),
  };
});

describe('getOrCreateUserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return existing user if found', async () => {
    const mockedGetUserByGameUserId = vi.mocked(getUserByGameUserIdQuery);
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

    const result = await getOrCreateUserService(gameUser);

    expect(getUserByGameUserIdQuery).toHaveBeenCalledWith(gameUser.id);
    expect(createUserQuery).not.toHaveBeenCalled();

    expect(result).toEqual({ isNew: false, user: existingUser });
  });

  it('should create a new user if not found', async () => {
    const mockedGetUserByGameUserId = vi.mocked(getUserByGameUserIdQuery);
    const mockedCreateUser = vi.mocked(createUserQuery);
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

    const result = await getOrCreateUserService(gameUser);

    expect(getUserByGameUserIdQuery).toHaveBeenCalledWith(gameUser.id);
    expect(createUserQuery).toHaveBeenCalledWith({
      avatarUrl: gameUser.avatarUrl,
      country: gameUser.country,
      gameUserId: gameUser.id,
      name: gameUser.name,
    });

    expect(result).toEqual({ isNew: true, user: newUser });
  });
});
