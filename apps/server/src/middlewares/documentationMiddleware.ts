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
const server = apiSpecification.servers.at(0)!;

if (!environmentConfig.isDevelopmentMode) {
  server.variables.environment.default = environmentConfig.nodeEnv;
  server.variables.environment.enum.shift();
}

export const documentation: RequestHandler = swaggerUi.setup(apiSpecification, {
  customCss: new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DARK),
});
