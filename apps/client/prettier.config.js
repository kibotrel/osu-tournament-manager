import { nodeConfiguration } from '@packages/prettier-config';

export default {
  ...nodeConfiguration,
  plugins: ['prettier-plugin-tailwindcss'],
};
