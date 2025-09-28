import { matchedData, validationResult } from 'express-validator';
import { describe, expect, it } from 'vitest';

import { createMatchValidators } from './createMatchValidators.js';

describe('createMatchValidators', () => {
  describe('name', () => {
    it('should pass when it is a string', async () => {
      const request = { body: { name: 'test name' } };
      const validators = createMatchValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail when name is not a string', async () => {
      const request = { body: { name: 1 } };
      const validators = createMatchValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().length).toBe(1);
      expect(errors.array()).toEqual([
        {
          type: 'field',
          value: 1,
          msg: {
            message: 'name must be a string',
            errorCode: 'validator.createMatchBodyValidator.name.string',
          },
          path: 'name',
          location: 'body',
        },
      ]);
    });

    it('should fail when missing', async () => {
      const request = { body: {} };
      const validators = createMatchValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().length).toBe(3);
      expect(errors.array()).toEqual([
        {
          type: 'field',
          value: undefined,
          msg: {
            message: 'name is required',
            errorCode: 'validator.createMatchBodyValidator.name.required',
          },
          path: 'name',
          location: 'body',
        },
        {
          type: 'field',
          value: undefined,
          msg: {
            message: 'name must be a string',
            errorCode: 'validator.createMatchBodyValidator.name.string',
          },
          path: 'name',
          location: 'body',
        },
        {
          type: 'field',
          value: undefined,
          msg: {
            message: 'name cannot be empty',
            errorCode: 'validator.createMatchBodyValidator.name.empty',
          },
          path: 'name',
          location: 'body',
        },
      ]);
    });

    it('should fail when empty', async () => {
      const request = { params: { name: '' } };
      const validators = createMatchValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().length).toBe(3);
      expect(errors.array()).toEqual([
        {
          type: 'field',
          value: undefined,
          msg: {
            message: 'name is required',
            errorCode: 'validator.createMatchBodyValidator.name.required',
          },
          path: 'name',
          location: 'body',
        },
        {
          type: 'field',
          value: undefined,
          msg: {
            message: 'name must be a string',
            errorCode: 'validator.createMatchBodyValidator.name.string',
          },
          path: 'name',
          location: 'body',
        },
        {
          type: 'field',
          value: undefined,
          msg: {
            message: 'name cannot be empty',
            errorCode: 'validator.createMatchBodyValidator.name.empty',
          },
          path: 'name',
          location: 'body',
        },
      ]);
    });

    it('should trim value', async () => {
      const request = { body: { name: '   test name   ' } };
      const validators = createMatchValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);
      const { name } = matchedData<{
        name: string;
      }>(request);

      expect(errors.isEmpty()).toBe(true);
      expect(name).toBe('test name');
    });

    it('should escape value', async () => {
      const request = { body: { name: '<b>test</b>' } };
      const validators = createMatchValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);
      const { name } = matchedData<{
        name: string;
      }>(request);

      expect(errors.isEmpty()).toBe(true);
      expect(name).toBe('&lt;b&gt;test&lt;&#x2F;b&gt;');
    });
  });
});
