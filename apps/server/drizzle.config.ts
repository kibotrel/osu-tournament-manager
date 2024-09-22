import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

const isLocalEnvironment = Boolean(process.argv.at(3) === 'local');

export default defineConfig({
  dbCredentials: {
    database: process.env.POSTGRES_DB || '',
    host: isLocalEnvironment ? '127.0.0.1' : process.env.POSTGRES_HOST || '',
    password: process.env.POSTGRES_PASSWORD || '',
    port: Number(process.env.POSTGRES_PORT) || Number.NaN,
    ssl: false,
    user: process.env.POSTGRES_USER || '',
  },
  dialect: 'postgresql',
  migrations: {
    schema: 'drizzle',
    table: 'migrations',
  },
  out: './migrations',
  schema: './dist/src/schemas/*',
});
