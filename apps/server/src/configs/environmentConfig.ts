export const environmentConfig = {
  isDevelopmentMode: process.env.NODE_ENV === 'development',
  isProductionMode: process.env.NODE_ENV === 'production',
  isTestMode: process.env.NODE_ENV === 'test',
  sessionSecret: process.env.SESSION_SECRET || '',
};
