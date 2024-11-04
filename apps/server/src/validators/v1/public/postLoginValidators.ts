import type { ValidationChain } from 'express-validator';
import { body } from 'express-validator';

const postLoginBodyValidator = (): ValidationChain[] => {
  return [
    body('authenticationCode').escape().trim().hide().notEmpty().withMessage({
      message: 'Authentication code cannot be empty',
      errorCode: 'validator.postLoginBodyValidator.authenticationCode.empty',
    }),
  ];
};

export const postLoginValidators = () => {
  return [...postLoginBodyValidator()];
};
