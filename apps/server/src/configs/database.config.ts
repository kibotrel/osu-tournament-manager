export const databaseConfig = {
  database: process.env.POSTGRES_DB || '',
  host: process.env.POSTGRES_HOST || '',
  password: process.env.POSTGRES_PASSWORD || '',
  port: Number(process.env.POSTGRES_PORT) || Number.NaN,
  user: process.env.POSTGRES_USER || '',
};
