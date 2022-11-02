import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    deps: {
      inline: ['vitest-canvas-mock'],
    },
    threads: false,
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
