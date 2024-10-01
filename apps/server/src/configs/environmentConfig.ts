export const environmentConfig = {
  baseUrl: process.env.BASE_URL || '',
  expressPort: Number(process.env.EXPRESS_PORT) || Number.NaN,
  isDevelopmentMode: process.env.NODE_ENV === 'development',
  isProductionMode: process.env.NODE_ENV === 'production',
  isTestMode: process.env.NODE_ENV === 'test',
  osuClientId: Number(process.env.OSU_CLIENT_ID) || Number.NaN,
  osuClientSecret: process.env.OSU_CLIENT_SECRET || '',
  sessionSecret: process.env.SESSION_SECRET || '',
};
