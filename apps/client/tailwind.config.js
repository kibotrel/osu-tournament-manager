import { customTheme } from '#src/assets/styles/tailwind.theme.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/components/**/*.{html,vue,js,ts}',
    './src/pages/**/*.{html,vue,js,ts}',
    './index.html',
  ],
  theme: {
    extend: customTheme,
  },
  plugins: [],
};
