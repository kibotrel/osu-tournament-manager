import type { ValidationChain } from 'express-validator';
import { body } from 'express-validator';

const postLoginBodyValidator = (): ValidationChain[] => {
  return [
    body('authenticationCode')
      .exists()
      .withMessage({
        message: 'AuthenticationCode is required',
        errorCode:
          'validator.postLoginBodyValidator.authenticationCode.required',
      })
      .isString()
      .withMessage({
        message: 'AuthenticationCode must be a string',
        errorCode: 'validator.postLoginBodyValidator.authenticationCode.string',
      })
      .notEmpty()
      .withMessage({
        message: 'AuthenticationCode cannot be empty',
        errorCode: 'validator.postLoginBodyValidator.authenticationCode.empty',
      })
      .escape()
      .trim()
      .hide(),
  ];
};

export const postLoginValidators = () => {
  return [...postLoginBodyValidator()];
};
