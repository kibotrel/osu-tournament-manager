import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { databaseConfig } from '#src/configs/databaseConfig.js';

const { Client } = pg;

export const postgresClient = new Client(databaseConfig);

await postgresClient.connect();

export const database = drizzle(postgresClient);
