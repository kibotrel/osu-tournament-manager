import express from 'express';
import * as swaggerUi from 'swagger-ui-express';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { documentation } from '#src/dependencies/documentationDependency.js';

const app = express();

app.use('/documentation', swaggerUi.serve, documentation);

app.listen(environmentConfig.expressPort, () => {
  console.log(`Server is running on port ${environmentConfig.expressPort}`);
});
