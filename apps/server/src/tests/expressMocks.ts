import { randomUUID } from 'node:crypto';

import { Time } from '@packages/shared';
import type { Request, Response } from 'express';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

export const expressNextFunctionMock = (): Mock => {
  return vi.fn();
};

export const expressRequestMock = <
  PathParametersType = never,
  ResponseBodyType = never,
  RequestBodyType = never,
  RequestQueryType = never,
>() => {
  const request: Partial<
    Request<
      PathParametersType,
      ResponseBodyType,
      RequestBodyType,
      RequestQueryType
    >
  > = {
    body: {} as RequestBodyType,
    params: {} as PathParametersType,
    query: {} as RequestQueryType,
  };

  request.session = {
    cookie: {
      path: '/',
      secure: true,
      httpOnly: true,
      originalMaxAge: Time.Week,
    },

    destroy: vi.fn().mockImplementation(() => {
      return request.session;
    }),

    id: randomUUID(),

    reload: vi.fn().mockImplementation(() => {
      return request.session;
    }),

    regenerate: vi.fn().mockImplementation(() => {
      return request.session;
    }),

    resetMaxAge: vi.fn().mockImplementation(() => {
      return request.session;
    }),

    save: vi.fn().mockImplementation(() => {
      return request.session;
    }),

    touch: vi.fn().mockImplementation(() => {
      return request.session;
    }),
  };

  return request as Request<
    PathParametersType,
    ResponseBodyType,
    RequestBodyType,
    RequestQueryType
  >;
};

export const expressResponseMock = <ResponseBodyType = never>() => {
  const response: Partial<Response<ResponseBodyType>> = {
    json: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
  };

  return response as Response<ResponseBodyType>;
};
