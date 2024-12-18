/**
 * TODO: Rewrite this config to ESM
 * But currently electron-builder doesn't support ESM configs
 * @see https://github.com/develar/read-config-file/issues/10
 */

/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = async function () {
  const { getVersion } = await import('./version/getVersion.mjs');

  return {
    directories: {
      output: 'dist',
      buildResources: 'buildResources',
    },
    files: ['packages/**/dist/**'],
    extraFiles: [
      { from: 'Static', to: 'Static' },
      { from: 'Tools', to: 'resources\\app\\Tools' },
    ],
    extraMetadata: {
      version: getVersion(),
    },
    asarUnpack: ['Tools'],
    // Specify linux target just for disabling snap compilation
    linux: {
      target: 'deb',
    },
  };
};
