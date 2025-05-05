import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    include: ['src/**/*.unit.test.ts'],
    name: 'packages:bancho-client:unit',
  },
});
