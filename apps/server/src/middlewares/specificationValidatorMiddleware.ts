import path from 'node:path';
import { fileURLToPath } from 'node:url';

import OpenApiValidator from 'express-openapi-validator';

const directoryName = path.dirname(fileURLToPath(import.meta.url));

export const specificationValidator = OpenApiValidator.middleware({
  apiSpec: path.join(directoryName, '../assets/internal.openapi.json'),
});
