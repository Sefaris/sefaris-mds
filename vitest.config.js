import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

/**
 * Configuration for the global end-to-end testing,
 * placed in the project's root 'tests' folder.
 * @type {import('vite').UserConfig}
 * @see https://vitest.dev/config/
 */
const config = {
  plugins: [vue()],
  resolve: {
    alias: {
      // Renderer code imports from `#preload` (a virtual module bridged by a
      // Vite plugin in `packages/renderer/vite.config.js`). Tests under
      // `tests/` aren't run through that config, so we redirect the import to
      // an empty stub. Specs that actually need preload functionality replace
      // it via `vi.mock('#preload', ...)`.
      '#preload': fileURLToPath(new URL('./tests/__mocks__/preload-stub.ts', import.meta.url)),
    },
  },
  test: {
    /**
     * By default, vitest searches for the test files in all packages.
     * For e2e tests, have vitest search only in the project root 'tests' folder.
     */
    include: ['./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    /**
     * The default timeout of 5000ms is sometimes not enough for playwright.
     */
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
};

export default config;
