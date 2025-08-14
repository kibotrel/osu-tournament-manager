import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { databaseConfig } from '#src/configs/databaseConfig.js';

const { Pool } = pg;

export const postgresClient = new Pool(databaseConfig);

export const database = drizzle(postgresClient);
