import type { Request } from 'express';
import { describe, expect, it } from 'vitest';

import {
  HttpError,
  HttpInternalServerError,
  HttpMethodNotAllowedError,
  HttpNotFoundError,
} from '#src/classes/httpErrorClass.js';
import { HttpErrorReport } from '#src/classes/httpErrorReportClass.js';

describe('HttpErrorReport', () => {
  describe('constructor', () => {
    it('should instantiate with all necessary details', () => {
      const errorReport = new HttpErrorReport({
        error: new HttpError({ message: 'test message', status: 400 }),
        request: { path: '/resource/1' } as Request,
      });

      expect(errorReport.detail).toBe('test message');
      expect(errorReport.errors).toBeUndefined();
      expect(errorReport.instance).toBe('/resource/1');
      expect(errorReport.status).toBe(400);
      expect(errorReport.title).toBe('Bad Request');
    });

    it('should instantiate with errors array if provided', () => {
      const errorReport = new HttpErrorReport({
        error: new HttpError({
          errors: [{ error1: 'message1' }, { error2: 'message2' }],
          message: 'test message',
          status: 400,
        }),
        request: { path: '/resource/1' } as Request,
      });

      expect(errorReport.detail).toBe('test message');
      expect(errorReport.errors).toBeDefined();
      expect(Array.isArray(errorReport.errors)).toBe(true);
      expect(errorReport.errors).toHaveLength(2);
      expect(errorReport.instance).toBe('/resource/1');
      expect(errorReport.status).toBe(400);
      expect(errorReport.title).toBe('Bad Request');
    });

    it('should not expose errors and detail for status code 500', () => {
      const errorReport = new HttpErrorReport({
        error: new HttpInternalServerError({
          errors: [{ error1: 'message1' }, { error2: 'message2' }],
          message: 'test message',
        }),
        request: { path: '/resource/1' } as Request,
      });

      expect(errorReport.detail).toBeUndefined();
      expect(errorReport.errors).toBeUndefined();
      expect(errorReport.instance).toBe('/resource/1');
      expect(errorReport.status).toBe(500);
      expect(errorReport.title).toBe('Internal Server Error');
    });

    it('should not expose errors and detail for status code 404', () => {
      const errorReport = new HttpErrorReport({
        error: new HttpNotFoundError({ message: 'test message' }),
        request: { path: '/resource/1' } as Request,
      });

      expect(errorReport.detail).toBeUndefined();
      expect(errorReport.errors).toBeUndefined();
      expect(errorReport.instance).toBe('/resource/1');
      expect(errorReport.status).toBe(404);
      expect(errorReport.title).toBe('Not Found');
    });

    it('should not expose errors and detail for status code 405', () => {
      const errorReport = new HttpErrorReport({
        error: new HttpMethodNotAllowedError({ message: 'test message' }),
        request: { path: '/resource/1' } as Request,
      });

      expect(errorReport.detail).toBeUndefined();
      expect(errorReport.errors).toBeUndefined();
      expect(errorReport.instance).toBe('/resource/1');
      expect(errorReport.status).toBe(405);
      expect(errorReport.title).toBe('Method Not Allowed');
    });
  });

  describe('getAllowedMethods', () => {
    it('should return the allowed methods for a given path', () => {
      const errorReport = new HttpErrorReport({
        error: new HttpError({ message: 'test message', status: 400 }),
        request: { path: '/resource/1' } as Request,
        allowedHttpMethodsOnResource: {
          '/resource/x': ['GET', 'POST'],
        },
      });

      expect(errorReport.getAllowedMethods()).toBe('GET, POST');
    });

    it('should return an empty string if no allowed methods are defined', () => {
      const errorReport = new HttpErrorReport({
        error: new HttpError({ message: 'test message', status: 400 }),
        request: { path: '/resource/1' } as Request,
      });

      expect(errorReport.getAllowedMethods()).toBe('');
    });
  });

  describe('serialize', () => {
    it('should serialize the error report correctly', () => {
      const errorReport = new HttpErrorReport({
        error: new HttpError({ message: 'test message', status: 400 }),
        request: { path: '/resource/1' } as Request,
      });
      const serialized = errorReport.serialize();

      expect(serialized).toEqual({
        instance: '/resource/1',
        status: 400,
        title: 'Bad Request',
        detail: 'test message',
        errors: undefined,
      });
    });

    it('should serialize the error report with errors', () => {
      const errorReport = new HttpErrorReport({
        error: new HttpError({
          errors: [{ error1: 'message1' }, { error2: 'message2' }],
          message: 'test message',
          status: 400,
        }),
        request: { path: '/resource/1' } as Request,
      });
      const serialized = errorReport.serialize();

      expect(serialized).toEqual({
        instance: '/resource/1',
        status: 400,
        title: 'Bad Request',
        detail: 'test message',
        errors: [{ error1: 'message1' }, { error2: 'message2' }],
      });
    });

    it('should serialize the error report with no detail and errors for status 500', () => {
      const errorReport = new HttpErrorReport({
        error: new HttpInternalServerError({
          errors: [{ error1: 'message1' }, { error2: 'message2' }],
          message: 'test message',
        }),
        request: { path: '/resource/1' } as Request,
      });
      const serialized = errorReport.serialize();

      expect(serialized).toEqual({
        instance: '/resource/1',
        status: 500,
        title: 'Internal Server Error',
        detail: undefined,
        errors: undefined,
      });
    });

    it('should serialize the error report with no detail and errors for status 404', () => {
      const errorReport = new HttpErrorReport({
        error: new HttpNotFoundError({
          errors: [{ error1: 'message1' }, { error2: 'message2' }],
          message: 'test message',
        }),
        request: { path: '/resource/1' } as Request,
      });
      const serialized = errorReport.serialize();

      expect(serialized).toEqual({
        instance: '/resource/1',
        status: 404,
        title: 'Not Found',
        detail: undefined,
        errors: undefined,
      });
    });

    it('should serialize the error report with no detail and errors for status 405', () => {
      const errorReport = new HttpErrorReport({
        error: new HttpMethodNotAllowedError({
          errors: [{ error1: 'message1' }, { error2: 'message2' }],
          message: 'test message',
        }),
        request: { path: '/resource/1' } as Request,
      });
      const serialized = errorReport.serialize();

      expect(serialized).toEqual({
        instance: '/resource/1',
        status: 405,
        title: 'Method Not Allowed',
        detail: undefined,
        errors: undefined,
      });
    });
  });
});
