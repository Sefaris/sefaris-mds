import { chrome } from '../../.electron-vendors.cache.json' with { type: 'json' };
import vue from '@vitejs/plugin-vue';
import { join, resolve, dirname } from 'node:path';
import { readFileSync } from 'node:fs';
import { injectAppVersion } from '../../version/inject-app-version-plugin.mjs';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { fileURLToPath } from 'url';

const PACKAGE_ROOT = import.meta.dirname;
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
      '@assets': resolve(PACKAGE_ROOT, 'assets'),
      '@public': resolve(PACKAGE_ROOT, 'public'),
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
    preloadBridge(),
    injectAppVersion(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), '../../locales/**'),
    }),
  ],
};

/**
 * Plugin to bridge #preload imports to globalThis properties
 * exposed by contextBridge in the preload script.
 */
function preloadBridge() {
  const PRELOAD_MODULE_ID = '#preload';
  const RESOLVED_ID = '\0virtual:preload';
  const EXPOSED_PREFIX = '__electron_preload__';

  return {
    name: 'electron-preload-bridge',
    resolveId(id) {
      if (id === PRELOAD_MODULE_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id === RESOLVED_ID) {
        const preloadSrc = readFileSync(join(PACKAGE_ROOT, '../preload/src/index.ts'), 'utf-8');
        const exportNames = [];
        const re = /export\s+\{([^}]+)\}/g;
        let match;
        while ((match = re.exec(preloadSrc)) !== null) {
          const names = match[1]
            .split(',')
            .map(n => n.trim())
            .filter(Boolean);
          exportNames.push(...names);
        }
        return exportNames
          .map(
            name =>
              `export const ${name} = (...args) => globalThis['${EXPOSED_PREFIX}${name}'](...args);`,
          )
          .join('\n');
      }
    },
  };
}

export default config;
