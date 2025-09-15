import { matchedData, validationResult } from 'express-validator';
import { describe, expect, it } from 'vitest';

import { loginValidators } from './loginValidators.js';

describe('loginValidators', () => {
  describe('authenticationCode', () => {
    it('should pass when it is a string', async () => {
      const request = { body: { authenticationCode: 'abc123' } };
      const validators = loginValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail when value is not a string', async () => {
      const request = { body: { authenticationCode: 1 } };
      const validators = loginValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().length).toBe(1);
      expect(errors.array()).toEqual([
        {
          location: 'body',
          msg: {
            errorCode:
              'validator.postLoginBodyValidator.authenticationCode.string',
            message: 'AuthenticationCode must be a string',
          },
          path: 'authenticationCode',
          type: 'field',
        },
      ]);
    });

    it('should fail if missing', async () => {
      const request = { body: {} };
      const validators = loginValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().length).toBe(3);
      expect(errors.array()).toEqual([
        {
          location: 'body',
          msg: {
            errorCode:
              'validator.postLoginBodyValidator.authenticationCode.required',
            message: 'AuthenticationCode is required',
          },
          path: 'authenticationCode',
          type: 'field',
        },
        {
          location: 'body',
          msg: {
            errorCode:
              'validator.postLoginBodyValidator.authenticationCode.string',
            message: 'AuthenticationCode must be a string',
          },
          path: 'authenticationCode',
          type: 'field',
        },
        {
          location: 'body',
          msg: {
            errorCode:
              'validator.postLoginBodyValidator.authenticationCode.empty',
            message: 'AuthenticationCode cannot be empty',
          },
          path: 'authenticationCode',
          type: 'field',
        },
      ]);
    });

    it('should fail if empty', async () => {
      const request = { body: { authenticationCode: '' } };
      const validators = loginValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().length).toBe(1);
      expect(errors.array()).toEqual([
        {
          location: 'body',
          msg: {
            errorCode:
              'validator.postLoginBodyValidator.authenticationCode.empty',
            message: 'AuthenticationCode cannot be empty',
          },
          path: 'authenticationCode',
          type: 'field',
        },
      ]);
    });

    it('should trim value', async () => {
      const request = { body: { authenticationCode: '  abc123  ' } };
      const validators = loginValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);
      const { authenticationCode } = matchedData<{
        authenticationCode: string;
      }>(request);

      expect(errors.isEmpty()).toBe(true);
      expect(authenticationCode).toBe('abc123');
    });

    it('should escape value', async () => {
      const request = {
        body: { authenticationCode: '<b>test</b>' },
      };
      const validators = loginValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);
      const { authenticationCode } = matchedData<{
        authenticationCode: string;
      }>(request);

      expect(errors.isEmpty()).toBe(true);
      expect(authenticationCode).toBe('&lt;b&gt;test&lt;&#x2F;b&gt;');
    });
  });
});
