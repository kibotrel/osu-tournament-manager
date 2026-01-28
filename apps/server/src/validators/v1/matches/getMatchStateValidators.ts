import type { ValidationChain } from 'express-validator';
import { param } from 'express-validator';

const getMatchStateParametersValidator = (): ValidationChain[] => {
  return [
    param('gameMatchId')
      .exists()
      .withMessage({
        message: 'gameMatchId is required',
        errorCode:
          'validator.getMatchStateParametersValidator.gameMatchId.required',
      })
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage({
        message: 'gameMatchId must be a positive integer string',
        errorCode:
          'validator.getMatchStateParametersValidator.gameMatchId.integer',
      })
      .notEmpty()
      .withMessage({
        message: 'gameMatchId cannot be empty',
        errorCode:
          'validator.getMatchStateParametersValidator.gameMatchId.empty',
      })
      .escape()
      .trim(),
  ];
};

export const getMatchStateValidators = () => {
  return [...getMatchStateParametersValidator()];
};
