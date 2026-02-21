import { Router } from 'express';
import { serve } from 'swagger-ui-express';

import { apiDocumentation } from '#src/routes/api.documentation.js';
import { v1Router } from '#src/routes/v1/v1.router.js';

const apiRouter: Router = Router({ caseSensitive: true, strict: true });

apiRouter.use('/documentation', serve, apiDocumentation);
apiRouter.use('/v1', v1Router);

export { apiRouter };
