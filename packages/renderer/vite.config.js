/* eslint-env node */

import { chrome } from '../../.electron-vendors.cache.json';
import vue from '@vitejs/plugin-vue';
import { renderer } from 'unplugin-auto-expose';
import { join, resolve, dirname } from 'node:path';
import { injectAppVersion } from '../../version/inject-app-version-plugin.mjs';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { fileURLToPath } from 'url';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
      '@assets': resolve(__dirname, 'assets'),
      '@public': resolve(__dirname, 'public'),
    },
  },
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: join(PACKAGE_ROOT, 'index.html'),
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  test: {
    environment: 'happy-dom',
  },
  plugins: [
    vue(),
    renderer.vite({
      preloadEntry: join(PACKAGE_ROOT, '../preload/src/index.ts'),
    }),
    injectAppVersion(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), '../../locales/**'),
    }),
  ],
};

export default config;
