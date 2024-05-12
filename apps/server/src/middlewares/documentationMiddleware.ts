import type { RequestHandler } from 'express';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import swaggerUi from 'swagger-ui-express';

import internalSpecification from '#src/assets/internal.json' assert { type: 'json' };
import publicSpecification from '#src/assets/public.json' assert { type: 'json' };
import { environmentConfig } from '#src/configs/environmentConfig.js';

const apiSpecification = environmentConfig.isDevelopmentMode
  ? internalSpecification
  : publicSpecification;

export const documentation: RequestHandler = swaggerUi.setup(apiSpecification, {
  customCss: new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DARK),
});
