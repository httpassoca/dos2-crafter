import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [svelte()],
  // client build of svelte so $state in src/lib/*.svelte.ts behaves as in the app
  resolve: { conditions: ['browser'] },
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    setupFiles: ['test/setup.ts'],
    testTimeout: 30_000,
  },
})
