import { environmentConfig } from '#src/configs/environment.config.js';

const response = await fetch(
  `http://localhost:${environmentConfig.expressPort}/api/v1/public/health`,
);

process.exitCode = response.ok ? 0 : 1;
