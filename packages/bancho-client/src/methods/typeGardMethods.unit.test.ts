import { Socket } from 'node:net';

import { describe, expect, it } from 'vitest';

import { IrcClientState } from '#src/constants/ircConstants.js';
import {
  isDirectMessageChannel,
  isPublicChannel,
  isSocketReady,
} from '#src/methods/typeGardMethods.js';

describe('isDirectMessageChannel', () => {
  it('should return true if input is a direct message channel', () => {
    expect(isDirectMessageChannel('username')).toBe(true);
  });

  it('should return false if input is a public channel', () => {
    expect(isDirectMessageChannel('#channel')).toBe(false);
  });
});

describe('isPublicChannel', () => {
  it('should return true if input is a public channel', () => {
    expect(isPublicChannel('#channel')).toBe(true);
  });

  it('should return false if input is a direct message channel', () => {
    expect(isPublicChannel('username')).toBe(false);
  });
});

describe('isSocketReady', () => {
  it('should return true if socket is writable and given state is connected', () => {
    expect(isSocketReady(IrcClientState.Connected, new Socket())).toBe(true);
  });

  it('should return true if socket is writable and given state is connecting', () => {
    expect(isSocketReady(IrcClientState.Connecting, new Socket())).toBe(true);
  });

  it('should return false if socket is not writable', () => {
    expect(
      isSocketReady(IrcClientState.Connected, new Socket().destroy()),
    ).toBe(false);
  });

  it('should return false if socket is writable and given state is disconnected', () => {
    expect(isSocketReady(IrcClientState.Disconnected, new Socket())).toBe(
      false,
    );
  });

  it('should return false if socket is writable and given state is disconnecting', () => {
    expect(isSocketReady(IrcClientState.Disconnecting, new Socket())).toBe(
      false,
    );
  });
});
