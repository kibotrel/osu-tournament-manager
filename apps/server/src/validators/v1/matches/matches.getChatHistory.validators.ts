import type { ValidationChain } from 'express-validator';
import { param } from 'express-validator';

const getMatchChatHistoryParametersValidator = (): ValidationChain[] => {
  return [
    param('gameMatchId')
      .exists()
      .withMessage({
        message: 'gameMatchId is required',
        errorCode:
          'validator.getMatchChatHistoryParametersValidator.gameMatchId.required',
      })
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage({
        message: 'gameMatchId must be a positive integer string',
        errorCode:
          'validator.getMatchChatHistoryParametersValidator.gameMatchId.integer',
      })
      .notEmpty()
      .withMessage({
        message: 'gameMatchId cannot be empty',
        errorCode:
          'validator.getMatchChatHistoryParametersValidator.gameMatchId.empty',
      })
      .escape()
      .trim(),
  ];
};

export const getMatchChatHistoryValidators = () => {
  return [...getMatchChatHistoryParametersValidator()];
};
