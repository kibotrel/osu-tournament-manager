import type { ValidationChain } from 'express-validator';
import { param } from 'express-validator';

const closeMatchParametersValidator = (): ValidationChain[] => {
  return [
    param('id')
      .exists()
      .withMessage({
        message: 'id is required',
        errorCode: 'validator.closeMatchParametersValidator.id.required',
      })
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage({
        message: 'id must be a positive integer string',
        errorCode: 'validator.closeMatchParametersValidator.id.integer',
      })
      .notEmpty()
      .withMessage({
        message: 'id cannot be empty',
        errorCode: 'validator.closeMatchParametersValidator.id.empty',
      })
      .escape()
      .trim(),
  ];
};

export const closeMatchValidators = () => {
  return [...closeMatchParametersValidator()];
};
