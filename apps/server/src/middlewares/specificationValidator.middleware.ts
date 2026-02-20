import path from 'node:path';
import { fileURLToPath } from 'node:url';

import OpenApiValidator from 'express-openapi-validator';

import { environmentConfig } from '#src/configs/environment.config.js';

const directoryName = path.dirname(fileURLToPath(import.meta.url));
const apiSpecification = environmentConfig.isDevelopmentMode
  ? 'internal.openapi.json'
  : 'public.openapi.json';

export const specificationValidator = OpenApiValidator.middleware({
  apiSpec: path.join(
    directoryName,
    '../../node_modules/@packages/api-specification/dist/src',
    apiSpecification,
  ),
});
