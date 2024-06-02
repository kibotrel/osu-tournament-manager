export const environmentConfig = {
  expressPort: Number(process.env.EXPRESS_PORT) || Number.NaN,
  isDevelopmentMode: process.env.NODE_ENV === 'development',
  isProductionMode: process.env.NODE_ENV === 'production',
  isTestMode: process.env.NODE_ENV === 'test',
  sessionSecret: process.env.SESSION_SECRET || '',
};
