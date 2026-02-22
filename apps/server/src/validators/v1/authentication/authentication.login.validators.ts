import type { ValidationChain } from 'express-validator';
import { body } from 'express-validator';

const loginBodyValidator = (): ValidationChain[] => {
  return [
    body('authenticationCode')
      .exists()
      .withMessage({
        message: 'authenticationCode is required',
        errorCode: 'validator.loginBodyValidator.authenticationCode.required',
      })
      .isString()
      .withMessage({
        message: 'authenticationCode must be a string',
        errorCode: 'validator.loginBodyValidator.authenticationCode.string',
      })
      .notEmpty()
      .withMessage({
        message: 'authenticationCode cannot be empty',
        errorCode: 'validator.loginBodyValidator.authenticationCode.empty',
      })
      .escape()
      .trim()
      .hide(),
  ];
};

export const loginValidators = () => {
  return [...loginBodyValidator()];
};
