import type { ValidationChain } from 'express-validator';
import { body } from 'express-validator';

const createMatchBodyValidator = (): ValidationChain[] => {
  return [
    body('name')
      .exists()
      .withMessage({
        message: 'name is required',
        errorCode: 'validator.createMatchBodyValidator.name.required',
      })
      .isString()
      .withMessage({
        message: 'name must be a string',
        errorCode: 'validator.createMatchBodyValidator.name.string',
      })
      .notEmpty()
      .withMessage({
        message: 'name cannot be empty',
        errorCode: 'validator.createMatchBodyValidator.name.empty',
      })
      .escape()
      .trim(),
  ];
};

export const createMatchValidators = () => {
  return [...createMatchBodyValidator()];
};
