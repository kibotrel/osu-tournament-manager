import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { databaseConfig } from '#src/configs/databaseConfig.js';

const { Client } = pg;

export const client = new Client(databaseConfig);

await client.connect();

export const database = drizzle(client);
