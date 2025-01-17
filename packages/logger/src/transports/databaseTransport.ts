import type { Client } from 'pg';
import { format } from 'winston';

import { DatabaseTransport } from '#src/classes/databaseTransportClass.js';
import { baseDatabaseFormat } from '#src/formats/databaseFormats.js';

const { combine } = format;

export const databaseTransport = (databaseClient: Client) => {
  return new DatabaseTransport({
    databaseClient,
    format: combine(...baseDatabaseFormat),
    handleRejections: false,
    handleExceptions: false,
  });
};
