import { HttpBadRequestError } from '@packages/shared';
import type { RequestHandler } from 'express';
import type { Result } from 'express-validator';
import { validationResult } from 'express-validator';

/**
 * This processing is done to make input validation errors consistent
 * with those coming from [`express-openapi-validator`](https://www.npmjs.com/package/express-openapi-validator)
 * to remain compliant with [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html).
 */
const formatValidationErrors = (errors: Result) => {
  return errors.array().map((error) => {
    if (error.type === 'field') {
      return {
        path: `/${error.location}/${error.path}`,
        message: error.msg.message,
        errorCode: error.msg.errorCode,
      };
    }

    return error;
  });
};

export const validateRequest: RequestHandler = (request, _response, next) => {
  const validationErrors = validationResult(request);

  if (validationErrors.isEmpty()) {
    return next();
  }

  const errors = formatValidationErrors(validationErrors);

  return next(
    new HttpBadRequestError({
      message: 'Input validation failed',
      errors,
    }),
  );
};
