import {
  internalApiSpecification,
  publicApiSpecification,
} from '@packages/api-specification';
import type { RequestHandler } from 'express';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import swaggerUi from 'swagger-ui-express';

import { environmentConfig } from '#src/configs/environmentConfig.js';

const apiSpecification = environmentConfig.isDevelopmentMode
  ? internalApiSpecification
  : publicApiSpecification;

export const documentation: RequestHandler = swaggerUi.setup(apiSpecification, {
  customCss: new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DARK),
});
