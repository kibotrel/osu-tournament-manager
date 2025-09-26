import type { ValidationChain } from 'express-validator';
import { param } from 'express-validator';

const getMatchParametersValidator = (): ValidationChain[] => {
  return [
    param('id')
      .exists()
      .withMessage({
        message: 'id is required',
        errorCode: 'validator.getMatchParametersValidator.id.required',
      })
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage({
        message: 'id must be a positive integer string',
        errorCode: 'validator.getMatchParametersValidator.id.integer',
      })
      .notEmpty()
      .withMessage({
        message: 'id cannot be empty',
        errorCode: 'validator.getMatchParametersValidator.id.empty',
      })
      .escape()
      .trim(),
  ];
};

export const getMatchValidators = () => {
  return [...getMatchParametersValidator()];
};
