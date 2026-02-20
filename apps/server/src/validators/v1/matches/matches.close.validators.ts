import type { ValidationChain } from 'express-validator';
import { param } from 'express-validator';

const closeMatchParametersValidator = (): ValidationChain[] => {
  return [
    param('gameMatchId')
      .exists()
      .withMessage({
        message: 'gameMatchId is required',
        errorCode:
          'validator.closeMatchParametersValidator.gameMatchId.required',
      })
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage({
        message: 'gameMatchId must be a positive integer string',
        errorCode:
          'validator.closeMatchParametersValidator.gameMatchId.integer',
      })
      .notEmpty()
      .withMessage({
        message: 'gameMatchId cannot be empty',
        errorCode: 'validator.closeMatchParametersValidator.gameMatchId.empty',
      })
      .escape()
      .trim(),
  ];
};

export const closeMatchValidators = () => {
  return [...closeMatchParametersValidator()];
};
