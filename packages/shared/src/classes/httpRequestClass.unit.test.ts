import { describe, expect, it } from 'vitest';

import { HttpRequest } from '#src/classes/httpRequestClass.js';
import { HttpHeader } from '#src/sharedExport.js';

describe('HttpRequest', () => {
  describe('constructor', () => {
    it('should instantiate with all default values', () => {
      const request = new HttpRequest();

      expect(request.baseApiEndpoint).toBe('');
      expect(request.baseUrl).toBe('');
      expect(request.httpHeaders).toBeInstanceOf(Headers);
      expect(request.httpHeaders.get('Content-Type')).toBe('application/json');
      expect(request.payload).toEqual({});
      expect(request.apiVersion).toBe('');
    });
  });

  describe('isPayloadEmpty', () => {
    it('should return true for empty payload', () => {
      const request = new HttpRequest();

      expect(request.isPayloadEmpty({})).toBe(true);
    });

    it('should return false for non-empty payload', () => {
      const request = new HttpRequest<{ key: string }>();

      expect(request.isPayloadEmpty({ key: 'value' })).toBe(false);
    });
  });

  describe('setApiVersion', () => {
    it('should set the API version', () => {
      const request = new HttpRequest();

      request.setApiVersion('v1');

      expect(request.apiVersion).toBe('v1');
    });
  });

  describe('setBaseApiEndpoint', () => {
    it('should set the base API endpoint', () => {
      const request = new HttpRequest();

      request.setBaseApiEndpoint('api');

      expect(request.baseApiEndpoint).toBe('api');
    });
  });

  describe('setBaseUrl', () => {
    it('should set the base URL', () => {
      const request = new HttpRequest();

      request.setBaseUrl('https://example.com');

      expect(request.baseUrl).toBe('https://example.com');
    });
  });

  describe('setHttpHeader', () => {
    it('should set an HTTP header', () => {
      const request = new HttpRequest();

      request.setHttpHeader(HttpHeader.Accept, 'application/json');

      expect(request.httpHeaders.get(HttpHeader.Accept)).toBe(
        'application/json',
      );
    });
  });

  describe('setPayload', () => {
    it('should set the payload', () => {
      const request = new HttpRequest<{ key: string }>();

      request.setPayload({ key: 'value' });

      expect(request.payload).toEqual({ key: 'value' });
    });

    it('should not set an empty payload if it is empty', () => {
      const request = new HttpRequest<{ key: string }>();

      request.setPayload({ key: 'value' });
      request.setPayload({});

      expect(request.payload).toEqual({ key: 'value' });
    });
  });
});
