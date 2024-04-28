import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { client, database } from '#src/dependencies/databaseDependency.js';

try {
  await migrate(database, { migrationsFolder: './migrations' });
} catch (error) {
  console.error(error);
}

await client.end();
