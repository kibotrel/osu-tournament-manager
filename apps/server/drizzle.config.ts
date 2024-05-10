import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

export default defineConfig({
  dbCredentials: {
    database: process.env.POSTGRES_DB || '',
    host: process.env.POSTGRES_HOST || '',
    password: process.env.POSTGRES_PASSWORD || '',
    port: Number(process.env.POSTGRES_PORT) || Number.NaN,
    user: process.env.POSTGRES_USER || '',
  },
  dialect: 'postgresql',
  migrations: {
    schema: 'drizzle',
    table: 'migrations',
  },
  out: './migrations',
  schema: './src/schemas/*',
});
