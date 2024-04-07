import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    include: [...configDefaults.include],
    coverage: {
      provider: 'v8',
      enabled: true,
      clean: true,
      cleanOnRerun: true,
      reportsDirectory: './coverage',
      reporter: ['text', 'html'],
      reportOnFailure: true,
      skipFull: false,
    },
    restoreMocks: true,
    sequence: {
      shuffle: true,
      seed: Date.now(),
    },
    typecheck: {
      checker: 'tsc',
    },
  },
})
