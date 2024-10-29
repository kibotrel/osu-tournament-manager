import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { databaseConfig } from '#src/configs/databaseConfig.js';
import { logger } from '#src/dependencies/loggerDependency.js';

const { Client } = pg;

export const postgresClient = new Client(databaseConfig);

await postgresClient.connect();
logger.debug('Postgres client connected!');

export const database = drizzle(postgresClient);
