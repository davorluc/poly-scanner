import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.{test,spec}.ts'],
    transformMode: { web: [/\.ts$/] },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    deps: {
      inline: ['src/utils/logger.ts', 'src/utils/config.ts'],
    },
  },
  optimizeDeps: {
    include: ['src/utils/logger.ts', 'src/utils/config.ts'],
  },
});