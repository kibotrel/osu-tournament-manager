import type {
  GetMatchChatHistoryRequestParameters,
  GetMatchChatHistoryResponseBody,
  WebSocketMatchMessage,
  WebSocketMessage,
} from '@packages/shared';
import { HttpStatusCode } from '@packages/shared';
import { matchedData } from 'express-validator';
import { describe, expect, it, vi } from 'vitest';

import { getMatchChatHistoryService } from '#src/services/matches/matches.service.js';
import {
  expressNextFunctionMock,
  expressRequestMock,
  expressResponseMock,
} from '#src/tests/express.mocks.js';

import { getMatchChatHistoryController } from './matches.getChatHistory.controller.js';

vi.mock('express-validator', () => {
  return {
    matchedData: vi.fn().mockImplementation((request) => {
      return { ...request.params, ...request.body, ...request.query };
    }),
  };
});

vi.mock('#src/services/matches/matches.service.js', () => {
  return {
    getMatchChatHistoryService: vi.fn(),
  };
});

describe('getMatchChatHistoryController', () => {
  it('should respond with status 200 and chat history data', async () => {
    const getMatchChatHistoryServiceMock = vi.mocked(
      getMatchChatHistoryService,
    );
    const next = expressNextFunctionMock();
    const request = expressRequestMock<
      GetMatchChatHistoryRequestParameters,
      GetMatchChatHistoryResponseBody
    >();
    const response = expressResponseMock<GetMatchChatHistoryResponseBody>();
    const chatHistory: Array<WebSocketMessage<WebSocketMatchMessage>> = [
      {
        message: { author: 'user1', content: 'hello' },
        timestamp: Date.now(),
        topic: `matches:1:chat-messages`,
      },
      {
        message: { author: 'user2', content: 'world' },
        timestamp: Date.now(),
        topic: `matches:1:chat-messages`,
      },
    ];

    request.params = { gameMatchId: '1' };
    getMatchChatHistoryServiceMock.mockResolvedValueOnce(chatHistory);

    await getMatchChatHistoryController(request, response, next);

    expect(matchedData).toHaveBeenCalledWith(request);
    expect(getMatchChatHistoryServiceMock).toHaveBeenCalledWith(
      request.params.gameMatchId,
    );
    expect(response.status).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(response.json).toHaveBeenCalledWith({ history: chatHistory });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error if getMatchChatHistoryService fails', async () => {
    const getMatchChatHistoryServiceMock = vi.mocked(
      getMatchChatHistoryService,
    );
    const next = expressNextFunctionMock();
    const request = expressRequestMock<
      GetMatchChatHistoryRequestParameters,
      GetMatchChatHistoryResponseBody
    >();
    const response = expressResponseMock<GetMatchChatHistoryResponseBody>();
    const error = new Error('Test error');

    request.params = { gameMatchId: '1' };
    getMatchChatHistoryServiceMock.mockRejectedValueOnce(error);

    await getMatchChatHistoryController(request, response, next);

    expect(matchedData).toHaveBeenCalledWith(request);
    expect(getMatchChatHistoryServiceMock).toHaveBeenCalledWith(
      request.params.gameMatchId,
    );
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
