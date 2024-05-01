import express from 'express';
import * as swaggerUi from 'swagger-ui-express';

import { documentation } from '#src/dependencies/documentationDependency.js';

const app = express();

app.use('/documentation', swaggerUi.serve, documentation);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
