import type { ErrorReport } from '@packages/shared';

import { BASE_API_ERROR_TRANSLATION_KEY_PREFIX } from './api.constants.js';

export const extractApiErrorMessageKeyFromError = (
  error: Error,
  options: { namespace: string },
) => {
  const { namespace } = options;
  const errorData = JSON.parse(error.message) as ErrorReport;

  if (errorData.detail) {
    return {
      errorName: errorData.detail,
      translationKey: `${BASE_API_ERROR_TRANSLATION_KEY_PREFIX}.${namespace}.${errorData.detail}`,
    };
  }

  const errorName =
    errorData.title.charAt(0).toLowerCase() +
    errorData.title.slice(1).replaceAll(/\s/g, '');

  return {
    errorName,
    translationKey: `${BASE_API_ERROR_TRANSLATION_KEY_PREFIX}.generics.${errorName}`,
  };
};
