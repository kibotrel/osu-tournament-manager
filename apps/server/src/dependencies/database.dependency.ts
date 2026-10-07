import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { databaseConfig } from '#src/configs/database.config.js';

export const postgresClient = new Pool(databaseConfig);
export const database = drizzle(postgresClient);
