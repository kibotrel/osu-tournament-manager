import type { ValidationChain } from 'express-validator';
import { param } from 'express-validator';

const getMatchParametersValidator = (): ValidationChain[] => {
  return [
    param('gameMatchId')
      .exists()
      .withMessage({
        message: 'gameMatchId is required',
        errorCode: 'validator.getMatchParametersValidator.gameMatchId.required',
      })
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage({
        message: 'gameMatchId must be a positive integer string',
        errorCode: 'validator.getMatchParametersValidator.gameMatchId.integer',
      })
      .notEmpty()
      .withMessage({
        message: 'gameMatchId cannot be empty',
        errorCode: 'validator.getMatchParametersValidator.gameMatchId.empty',
      })
      .escape()
      .trim(),
  ];
};

export const getMatchValidators = () => {
  return [...getMatchParametersValidator()];
};
