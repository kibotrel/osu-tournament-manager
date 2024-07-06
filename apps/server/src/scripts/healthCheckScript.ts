/* eslint-disable unicorn/no-process-exit */
import { environmentConfig } from '#src/configs/environmentConfig.js';

const response = await fetch(
  `http://localhost:${environmentConfig.expressPort}/api/v1/public/health`,
);
const exitCode = response.ok ? 0 : 1;

process.exit(exitCode);
