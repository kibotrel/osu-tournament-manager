import { describe, expect, it } from 'vitest';

import type { HttpErrorReport } from '#src/shared.export.js';
import {
  isBinaryObject,
  isErrorReport,
} from '#src/validators/object.validators.js';

describe('isBinaryObject', () => {
  it('should return true if input is a Blob', () => {
    expect(isBinaryObject(new Blob())).toBe(true);
  });

  it('should return false if input is an object', () => {
    expect(isBinaryObject({})).toBe(false);
  });

  it('should return false if input is an array', () => {
    expect(isBinaryObject([])).toBe(false);
  });
});

describe('isErrorReport', () => {
  it('should return true if input is an ErrorReport', () => {
    const errorReport: Omit<
      HttpErrorReport,
      'getAllowedMethods' | 'serialize'
    > = {
      instance: '/resource/1',
      status: 400,
      title: 'Bad Request',
    };

    expect(isErrorReport(errorReport)).toBe(true);
  });

  it('should return false if input is a partial ErrorReport', () => {
    const partialErrorReport: Partial<
      Omit<HttpErrorReport, 'getAllowedMethods' | 'serialize'>
    > = {
      instance: '/resource/1',
      status: 400,
    };

    expect(isErrorReport(partialErrorReport)).toBe(false);
  });

  it('should return false if input is a string', () => {
    expect(isErrorReport('test')).toBe(false);
  });

  it('should return false if input is null', () => {
    expect(isErrorReport(null)).toBe(false);
  });

  it('should return false if input is a number', () => {
    expect(isErrorReport(1)).toBe(false);
  });

  it('should return false if input is an array', () => {
    expect(isErrorReport([])).toBe(false);
  });

  it('should return false if input is an object without required properties', () => {
    const invalidErrorReport = {
      key: 'value',
    };

    expect(isErrorReport(invalidErrorReport)).toBe(false);
  });
});
