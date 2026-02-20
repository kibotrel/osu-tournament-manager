import { Router } from 'express';
import { serve } from 'swagger-ui-express';

import { documentation } from '#src/middlewares/documentation.middleware.js';
import { v1Router } from '#src/routes/v1/v1.router.js';

const apiRouter: Router = Router({ caseSensitive: true, strict: true });

apiRouter.use('/documentation', serve, documentation);
apiRouter.use('/v1', v1Router);

export { apiRouter };
