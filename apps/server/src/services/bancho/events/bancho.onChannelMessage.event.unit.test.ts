import { BanchoPublicChannel } from '@packages/bancho-client';
import type { WebSocketMatchMessage, WebSocketMessage } from '@packages/shared';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { addMatchMessageToCacheService } from '#src/services/cache/cache.service.js';
import { webSocketServer } from '#src/websocketServer.js';

import { onChannelMessage } from './bancho.onChannelMessage.event.js';

vi.mock('#src/dependencies/logger.dependency.js', () => {
  return { logger: { debug: vi.fn() } };
});

vi.mock('#src/services/cache/cache.service.js', () => {
  return { addMatchMessageToCacheService: vi.fn() };
});

vi.mock('#src/websocketServer.js', () => {
  return { webSocketServer: { broadcastMessageToSubscribers: vi.fn() } };
});

const message: WebSocketMessage<WebSocketMatchMessage> = {
  message: { author: 'user', content: 'test message' },
  timestamp: 1,
  topic: 'matches:1:chat-messages',
};

describe('onChannelMessage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add the message to the corresponding match history in cache', async () => {
    vi.spyOn(Date, 'now').mockReturnValueOnce(1);

    await onChannelMessage({
      channel: '#mp_1',
      message: 'test message',
      user: 'user',
    });

    expect(addMatchMessageToCacheService).toHaveBeenCalledWith({
      channel: 1,
      message: JSON.stringify(message),
    });
  });

  it('should broadcast the message to websocket subscribers', async () => {
    const webSocketServerMock = vi.mocked(
      webSocketServer.broadcastMessageToSubscribers,
    );

    await onChannelMessage({
      channel: '#mp_2',
      message: 'test message',
      user: 'user',
    });

    expect(webSocketServer.broadcastMessageToSubscribers).toHaveBeenCalledWith(
      expect.any(Buffer),
      { isBinary: false, isBanchoMessage: true },
    );

    const payload = JSON.parse(webSocketServerMock.mock.calls[0][0].toString());

    expect(payload).toEqual({
      message: { author: 'user', content: 'test message' },
      timestamp: expect.any(Number),
      topic: 'matches:2:chat-messages',
    });
  });

  it('should not do anything if channel lobby', async () => {
    const addMatchMessageToCacheServiceMock = vi.mocked(
      addMatchMessageToCacheService,
    );

    await onChannelMessage({
      channel: BanchoPublicChannel.Lobby,
      message: 'test message',
      user: 'user',
    });

    expect(addMatchMessageToCacheServiceMock).not.toHaveBeenCalled();
  });

  it('should not do anything for direct message channel', async () => {
    const addMatchMessageToCacheServiceMock = vi.mocked(
      addMatchMessageToCacheService,
    );

    await onChannelMessage({
      channel: 'direct_message',
      message: 'test message',
      user: 'user',
    });

    expect(addMatchMessageToCacheServiceMock).not.toHaveBeenCalled();
  });
});
