import { validationResult } from 'express-validator';
import { describe, expect, it } from 'vitest';

import { getMatchValidators } from './getMatchValidators.js';

describe('getMatchValidators', () => {
  describe('id', () => {
    it('should pass when it is a positive integer string', async () => {
      const request = { params: { id: '1' } };
      const validators = getMatchValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail when id is not a positive integer string', async () => {
      const request = { params: { id: 'abc' } };
      const validators = getMatchValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().length).toBe(1);
      expect(errors.array()).toEqual([
        {
          type: 'field',
          value: 'abc',
          msg: {
            message: 'id must be a positive integer string',
            errorCode: 'validator.getMatchParametersValidator.id.integer',
          },
          path: 'id',
          location: 'params',
        },
      ]);
    });

    it('should fail when missing', async () => {
      const request = { params: {} };
      const validators = getMatchValidators();

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
            message: 'id is required',
            errorCode: 'validator.getMatchParametersValidator.id.required',
          },
          path: 'id',
          location: 'params',
        },
        {
          type: 'field',
          value: undefined,
          msg: {
            message: 'id must be a positive integer string',
            errorCode: 'validator.getMatchParametersValidator.id.integer',
          },
          path: 'id',
          location: 'params',
        },
        {
          type: 'field',
          value: undefined,
          msg: {
            message: 'id cannot be empty',
            errorCode: 'validator.getMatchParametersValidator.id.empty',
          },
          path: 'id',
          location: 'params',
        },
      ]);
    });

    it('should fail when empty', async () => {
      const request = { params: { id: '' } };
      const validators = getMatchValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().length).toBe(2);
      expect(errors.array()).toEqual([
        {
          type: 'field',
          value: '',
          msg: {
            message: 'id must be a positive integer string',
            errorCode: 'validator.getMatchParametersValidator.id.integer',
          },
          path: 'id',
          location: 'params',
        },
        {
          type: 'field',
          value: '',
          msg: {
            message: 'id cannot be empty',
            errorCode: 'validator.getMatchParametersValidator.id.empty',
          },
          path: 'id',
          location: 'params',
        },
      ]);
    });

    it('should fail when id is a negative integer string', async () => {
      const request = { params: { id: '-5' } };
      const validators = getMatchValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().length).toBe(1);
      expect(errors.array()).toEqual([
        {
          type: 'field',
          value: '-5',
          msg: {
            message: 'id must be a positive integer string',
            errorCode: 'validator.getMatchParametersValidator.id.integer',
          },
          path: 'id',
          location: 'params',
        },
      ]);
    });

    it('should fail when id has leading zeroes', async () => {
      const request = { params: { id: '007' } };
      const validators = getMatchValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().length).toBe(1);
      expect(errors.array()).toEqual([
        {
          location: 'params',
          msg: {
            errorCode: 'validator.getMatchParametersValidator.id.integer',
            message: 'id must be a positive integer string',
          },
          path: 'id',
          type: 'field',
          value: '007',
        },
      ]);
    });
  });
});
