import { randomUUID } from 'node:crypto';

import { Time } from '@packages/shared';
import type { Request, Response } from 'express';
import { vi } from 'vitest';

export const expressNextFunctionMock = () => {
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
  > = {};

  request.body = {} as RequestBodyType;
  request.params = {} as PathParametersType;
  request.query = {} as RequestQueryType;

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
  const response: Partial<Response<ResponseBodyType>> = {};

  response.json = vi.fn().mockReturnThis();
  response.end = vi.fn().mockReturnThis();
  response.setHeader = vi.fn().mockReturnThis();
  response.status = vi.fn().mockReturnThis();

  return response as Response<ResponseBodyType>;
};
