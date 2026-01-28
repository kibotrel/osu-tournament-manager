import { validationResult } from 'express-validator';
import { describe, expect, it } from 'vitest';

import { getMatchStateValidators } from './getMatchStateValidators.js';

describe('getMatchStateValidators', () => {
  describe('gameMatchId', () => {
    it('should pass when it is a positive integer string', async () => {
      const request = { params: { gameMatchId: '1' } };
      const validators = getMatchStateValidators();

      for (const validator of validators) {
        await validator.run(request);
      }

      const errors = validationResult(request);

      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail when id is not a positive integer string', async () => {
      const request = { params: { gameMatchId: 'abc' } };
      const validators = getMatchStateValidators();

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
            message: 'gameMatchId must be a positive integer string',
            errorCode:
              'validator.getMatchStateParametersValidator.gameMatchId.integer',
          },
          path: 'gameMatchId',
          location: 'params',
        },
      ]);
    });

    it('should fail when missing', async () => {
      const request = { params: {} };
      const validators = getMatchStateValidators();

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
            message: 'gameMatchId is required',
            errorCode:
              'validator.getMatchStateParametersValidator.gameMatchId.required',
          },
          path: 'gameMatchId',
          location: 'params',
        },
        {
          type: 'field',
          value: undefined,
          msg: {
            message: 'gameMatchId must be a positive integer string',
            errorCode:
              'validator.getMatchStateParametersValidator.gameMatchId.integer',
          },
          path: 'gameMatchId',
          location: 'params',
        },
        {
          type: 'field',
          value: undefined,
          msg: {
            message: 'gameMatchId cannot be empty',
            errorCode:
              'validator.getMatchStateParametersValidator.gameMatchId.empty',
          },
          path: 'gameMatchId',
          location: 'params',
        },
      ]);
    });

    it('should fail when empty', async () => {
      const request = { params: { gameMatchId: '' } };
      const validators = getMatchStateValidators();

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
            message: 'gameMatchId must be a positive integer string',
            errorCode:
              'validator.getMatchStateParametersValidator.gameMatchId.integer',
          },
          path: 'gameMatchId',
          location: 'params',
        },
        {
          type: 'field',
          value: '',
          msg: {
            message: 'gameMatchId cannot be empty',
            errorCode:
              'validator.getMatchStateParametersValidator.gameMatchId.empty',
          },
          path: 'gameMatchId',
          location: 'params',
        },
      ]);
    });

    it('should fail when gameMatchId is a negative integer string', async () => {
      const request = { params: { gameMatchId: '-5' } };
      const validators = getMatchStateValidators();

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
            message: 'gameMatchId must be a positive integer string',
            errorCode:
              'validator.getMatchStateParametersValidator.gameMatchId.integer',
          },
          path: 'gameMatchId',
          location: 'params',
        },
      ]);
    });

    it('should fail when id has leading zeroes', async () => {
      const request = { params: { gameMatchId: '007' } };
      const validators = getMatchStateValidators();

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
            errorCode:
              'validator.getMatchStateParametersValidator.gameMatchId.integer',
            message: 'gameMatchId must be a positive integer string',
          },
          path: 'gameMatchId',
          type: 'field',
          value: '007',
        },
      ]);
    });
  });
});
