/* eslint-disable unicorn/no-process-exit */
import { readdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import journal from '../../migrations/meta/_journal.json' assert { type: 'json' };

const fileName = process.argv.at(2);
const migrationsDirectory = fileURLToPath(
  new URL('../../migrations', import.meta.url),
);

if (!fileName) {
  process.exit(0);
}

const filenames = await readdir(migrationsDirectory);
const lastMigrationFilename = filenames.at(-2);

if (!lastMigrationFilename) {
  process.exit(0);
}

const [id] = lastMigrationFilename.split('_');
const targetEntry = journal.entries.find((entry) => {
  return entry.idx === Number(id);
});

if (!targetEntry) {
  process.exit(0);
}

targetEntry.tag = `${id}_${fileName}`;

await writeFile(
  path.join(migrationsDirectory, `meta/_journal.json`),
  JSON.stringify(journal, undefined, 2),
);
await rename(
  path.join(migrationsDirectory, lastMigrationFilename),
  path.join(migrationsDirectory, `${targetEntry.tag}.sql`),
);
